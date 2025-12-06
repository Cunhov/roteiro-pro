
import React, { useState, useRef } from 'react';
import { FileText, Upload, Wand2, Copy, Check, Download, Loader2, AlignLeft, Type } from 'lucide-react';
import { LLMGateway } from '../services/llmGateway';
import { getDescriptionAgentPrompt, getTitleAgentPrompt } from '../utils/prompts';

interface Props {
  llmGateway: LLMGateway;
}

const CharCount = ({ text }: { text: string }) => (
    <span className="text-[10px] text-slate-500 font-mono ml-2">
        {text.length} chars
    </span>
);

const TitleDescriptionGenerator: React.FC<Props> = ({ llmGateway }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [descriptionResult, setDescriptionResult] = useState('');
  const [titleResult, setTitleResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => ev.target?.result && setInputText(ev.target.result as string);
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => ev.target?.result && setInputText(ev.target.result as string);
        reader.readAsText(file);
    }
  };

  const generate = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setError(null);
    setDescriptionResult('');
    setTitleResult('');

    try {
        // Parallel execution of both agents
        const descPromise = llmGateway.generateText(getDescriptionAgentPrompt(inputText));
        const titlePromise = llmGateway.generateText(getTitleAgentPrompt(inputText));

        const [desc, title] = await Promise.all([descPromise, titlePromise]);
        
        setDescriptionResult(desc);
        setTitleResult(title);
    } catch (err: any) {
        setError(err.message || "Erro ao gerar conteúdo.");
    } finally {
        setIsProcessing(false);
    }
  };

  const downloadFile = () => {
      const content = `=== TÍTULOS ===\n\n${titleResult}\n\n=== DESCRIÇÃO ===\n\n${descriptionResult}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube-metadata-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlignLeft className="text-orange-500" />
                Gerador de Título e Descrição
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                Utilize dois agentes especializados (SEO e Copywriting) para otimizar seus metadados.
            </p>

            {/* Input */}
            <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative space-y-2 group"
            >
                <div className="flex justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase">Transcrição (.SRT) ou Resumo</label>
                    <CharCount text={inputText} />
                </div>
                
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-300 text-xs font-mono resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Arraste seu arquivo .srt aqui ou cole o texto..."
                />
                
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-slate-600 text-xs flex items-center gap-1"
                >
                    <Upload size={14} /> Importar Arquivo
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".srt,.txt" onChange={handleFileUpload} />
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={generate}
                    disabled={isProcessing || !inputText.trim()}
                    className={`
                        px-8 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all
                        ${isProcessing || !inputText.trim()
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/20'
                        }
                    `}
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <Wand2 />}
                    <span>{isProcessing ? 'Agentes Trabalhando...' : 'Gerar Títulos e Descrição'}</span>
                </button>
            </div>
        </div>

        {error && (
            <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
                {error}
            </div>
        )}

        {(titleResult || descriptionResult) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                
                {/* Titles Output */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[600px]">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <Type className="text-purple-400" /> Títulos (Copywriting)
                        </div>
                        <button 
                            onClick={() => {navigator.clipboard.writeText(titleResult); setCopiedTitle(true); setTimeout(() => setCopiedTitle(false), 2000)}}
                            className="text-slate-400 hover:text-white"
                        >
                            {copiedTitle ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                        {titleResult}
                    </div>
                    <div className="mt-2 text-right">
                        <CharCount text={titleResult} />
                    </div>
                </div>

                {/* Description Output */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[600px]">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2 text-white font-bold">
                            <FileText className="text-blue-400" /> Descrição (SEO)
                        </div>
                        <button 
                            onClick={() => {navigator.clipboard.writeText(descriptionResult); setCopiedDesc(true); setTimeout(() => setCopiedDesc(false), 2000)}}
                            className="text-slate-400 hover:text-white"
                        >
                            {copiedDesc ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                        {descriptionResult}
                    </div>
                    <div className="mt-2 text-right">
                        <CharCount text={descriptionResult} />
                    </div>
                </div>
            </div>
        )}

        {(titleResult || descriptionResult) && (
            <div className="flex justify-center pt-6">
                <button 
                    onClick={downloadFile}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Download size={18} /> Baixar Tudo (.TXT)
                </button>
            </div>
        )}
    </div>
  );
};

export default TitleDescriptionGenerator;
