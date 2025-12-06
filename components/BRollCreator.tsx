
import React, { useState, useRef } from 'react';
import { Film, Upload, FileText, X, Loader2, Download, Image as ImageIcon, Search, Wand2, Settings2, PlayCircle } from 'lucide-react';
import { LLMGateway } from '../services/llmGateway';
import { BRollSegment, BRollConfig, BRollPacing, BRollSource } from '../types';
import { getBRollSegmentationPrompt } from '../utils/prompts';
import JSZip from 'jszip'; // Using CDN version via type augmentation or implicit global

// Declare JSZip for TypeScript if not installed via npm (CDN usage)
declare const JSZip: any;

interface BRollCreatorProps {
  llmGateway: LLMGateway;
}

const BRollCreator: React.FC<BRollCreatorProps> = ({ llmGateway }) => {
  const [inputText, setInputText] = useState('');
  const [config, setConfig] = useState<BRollConfig>({
    pacing: 'medium',
    source: 'mixed',
    refImages: []
  });
  
  const [segments, setSegments] = useState<BRollSegment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const refImageInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => ev.target?.result && setInputText(ev.target.result as string);
    reader.readAsText(file);
  };

  const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      
      const fileArray = Array.from(files) as File[];
      fileArray.slice(0, 5 - config.refImages.length).forEach(file => {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  setConfig(prev => ({...prev, refImages: [...prev.refImages, ev.target!.result as string]}));
              }
          };
          reader.readAsDataURL(file);
      });
  };

  // --- Core Logic ---

  const startProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setSegments([]);
    setError(null);
    setProcessingStatus('Analisando roteiro e segmentando...');

    try {
        // 1. Segmentation
        const prompt = getBRollSegmentationPrompt(inputText, config.pacing, config.source, config.mood, config.style);
        const jsonResponse = await llmGateway.generateText(prompt);
        
        let parsedSegments: BRollSegment[] = [];
        try {
            // Clean markdown code blocks if present
            const cleanJson = jsonResponse.replace(/```json|```/g, '').trim();
            parsedSegments = JSON.parse(cleanJson);
        } catch (e) {
            throw new Error("Falha ao interpretar resposta da IA (JSON inválido). Tente novamente.");
        }

        // Initialize segments
        setSegments(parsedSegments.map(s => ({ ...s, status: 'pending' })));

        // 2. Process Images (Sequential to avoid rate limits, or batched)
        setProcessingStatus('Gerando/Buscando imagens...');
        
        const newSegments = [...parsedSegments];
        
        for (let i = 0; i < newSegments.length; i++) {
            const segment = newSegments[i];
            setSegments(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'processing' } : s));
            
            try {
                let imageUrl = '';
                
                if (segment.sourceType === 'search') {
                    // Search Logic (Grounding)
                    const urls = await llmGateway.searchImages(segment.visualDescription);
                    if (urls.length > 0) {
                        imageUrl = urls[0];
                    } else {
                        // Fallback to generation if search fails
                        imageUrl = await llmGateway.generateImage(segment.visualDescription, config.refImages);
                    }
                } else {
                    // Generation Logic
                    imageUrl = await llmGateway.generateImage(segment.visualDescription, config.refImages);
                }

                newSegments[i] = { ...segment, imageUrl, status: 'completed' };
            } catch (err) {
                console.error(`Error processing segment ${segment.id}`, err);
                newSegments[i] = { ...segment, status: 'failed' };
            }
            
            // Update state progressively
            setSegments([...newSegments]);
        }
        
        setProcessingStatus('Concluído!');

    } catch (err: any) {
        setError(err.message || "Erro desconhecido no processo.");
    } finally {
        setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
      if (!JSZip) {
          alert("Biblioteca JSZip não carregada. Tente recarregar a página.");
          return;
      }

      const zip = new JSZip();
      const folder = zip.folder("b-rolls");

      // Filter completed segments with URLs
      const readySegments = segments.filter(s => s.status === 'completed' && s.imageUrl);

      for (const seg of readySegments) {
          try {
              if (seg.imageUrl?.startsWith('data:')) {
                  // Base64
                  const data = seg.imageUrl.split(',')[1];
                  folder.file(`${seg.id}_${seg.timestampStart.replace(/:/g,'-')}.png`, data, {base64: true});
              } else if (seg.imageUrl?.startsWith('http')) {
                  // URL - fetch it (might fail due to CORS if external, handle carefully)
                  // For demo, we assume we can fetch or it's a proxy. 
                  // In client-side only, CORS is a blocker for random URLs.
                  // If it's a generated URL from a proxy, it works. 
                  // For now, prompt user to download individually if CORS fails.
                  try {
                    const resp = await fetch(seg.imageUrl);
                    const blob = await resp.blob();
                    folder.file(`${seg.id}.jpg`, blob);
                  } catch (e) {
                      console.warn("CORS/Fetch error for zip", seg.imageUrl);
                  }
              }
          } catch (e) {
              console.error("Zip error", e);
          }
      }

      const content = await zip.generateAsync({type:"blob"});
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `b-rolls-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
        
        {/* Header & Config */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Film className="text-pink-500" />
                B-Roll Creator
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                Transforme roteiros ou legendas (.srt) em uma sequência visual de imagens geradas ou buscadas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Area */}
                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full h-48 bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-300 text-xs font-mono resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            placeholder="Cole o conteúdo do .SRT ou texto do roteiro aqui..."
                            readOnly={isProcessing}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-slate-600 text-xs flex items-center gap-1"
                        >
                            <Upload size={14} /> Importar .SRT
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept=".srt,.txt" onChange={handleFileUpload} />
                    </div>
                </div>

                {/* Settings Area */}
                <div className="space-y-4 bg-slate-950/30 p-4 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-slate-300 font-semibold text-sm">
                        <Settings2 size={16} /> Configurações de Geração
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Ritmo (Pacing)</label>
                            <select 
                                value={config.pacing}
                                onChange={(e) => setConfig({...config, pacing: e.target.value as BRollPacing})}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                            >
                                <option value="fast">Rápido (5-15s)</option>
                                <option value="medium">Médio (15-30s)</option>
                                <option value="slow">Lento (30-60s)</option>
                                <option value="auto">Automático</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Fonte da Imagem</label>
                            <select 
                                value={config.source}
                                onChange={(e) => setConfig({...config, source: e.target.value as BRollSource})}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white"
                            >
                                <option value="search">Buscar (Web)</option>
                                <option value="generate">Criar (IA)</option>
                                <option value="mixed">Misto (IA Decide)</option>
                            </select>
                        </div>
                    </div>

                    {(config.source !== 'search') && (
                        <div className="space-y-2">
                            <label className="text-xs text-slate-500 uppercase font-bold block">Referências (Opcional)</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {config.refImages.map((img, idx) => (
                                    <div key={idx} className="w-12 h-12 flex-shrink-0 relative rounded overflow-hidden border border-slate-700">
                                        <img src={img} className="w-full h-full object-cover" alt="ref" />
                                        <button 
                                            onClick={() => setConfig(prev => ({...prev, refImages: prev.refImages.filter((_, i) => i !== idx)}))}
                                            className="absolute inset-0 bg-black/50 hover:bg-red-500/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                                {config.refImages.length < 5 && (
                                    <button 
                                        onClick={() => refImageInputRef.current?.click()}
                                        className="w-12 h-12 flex-shrink-0 border border-dashed border-slate-600 rounded flex items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-white"
                                    >
                                        <Upload size={16} />
                                    </button>
                                )}
                                <input type="file" ref={refImageInputRef} className="hidden" accept="image/*" onChange={handleRefImageUpload} multiple />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <input 
                                    type="text" 
                                    placeholder="Estilo (ex: Realista, 3D)" 
                                    value={config.style || ''}
                                    onChange={(e) => setConfig({...config, style: e.target.value})}
                                    className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Mood (ex: Sombrio, Feliz)" 
                                    value={config.mood || ''}
                                    onChange={(e) => setConfig({...config, mood: e.target.value})}
                                    className="bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={startProcess}
                    disabled={isProcessing || !inputText.trim()}
                    className={`
                        px-8 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all
                        ${isProcessing || !inputText.trim()
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-900/20'
                        }
                    `}
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <PlayCircle />}
                    <span>{isProcessing ? processingStatus : 'Iniciar Geração de B-Rolls'}</span>
                </button>
            </div>
        </div>

        {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm flex items-start gap-2">
                <X size={18} className="mt-0.5 flex-shrink-0" />
                <div>{error}</div>
            </div>
        )}

        {/* Results Grid */}
        {segments.length > 0 && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ImageIcon size={18} /> Resultados ({segments.filter(s => s.status === 'completed').length}/{segments.length})
                    </h3>
                    <button 
                        onClick={downloadAll}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Download size={16} /> Baixar Tudo (ZIP)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {segments.map((segment) => (
                        <div key={segment.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg group">
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                                {segment.status === 'completed' && segment.imageUrl ? (
                                    <img src={segment.imageUrl} alt={segment.visualDescription} className="w-full h-full object-cover" />
                                ) : segment.status === 'processing' ? (
                                    <div className="flex flex-col items-center text-slate-500">
                                        <Loader2 className="animate-spin mb-2" size={24} />
                                        <span className="text-xs">Gerando...</span>
                                    </div>
                                ) : segment.status === 'failed' ? (
                                    <span className="text-red-500 text-xs">Falha</span>
                                ) : (
                                    <span className="text-slate-600 text-xs">Aguardando...</span>
                                )}

                                {/* Overlay info */}
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-mono">
                                    {segment.timestampStart} - {segment.timestampEnd}
                                </div>
                                <div className="absolute top-2 right-2">
                                     {segment.sourceType === 'generate' ? <Wand2 size={14} className="text-pink-400" /> : <Search size={14} className="text-blue-400" />}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <p className="text-slate-400 text-xs line-clamp-2 mb-2 italic">"{segment.textContext}"</p>
                                <p className="text-slate-200 text-sm font-medium line-clamp-2 mb-4" title={segment.visualDescription}>
                                    {segment.visualDescription}
                                </p>
                                
                                {segment.status === 'completed' && segment.imageUrl && (
                                    <div className="flex justify-end">
                                        <a 
                                            href={segment.imageUrl} 
                                            download={`broll_${segment.id}.png`}
                                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                                            title="Baixar Imagem"
                                        >
                                            <Download size={16} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default BRollCreator;
