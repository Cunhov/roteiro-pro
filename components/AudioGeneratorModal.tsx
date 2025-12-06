
import React, { useState, useEffect } from 'react';
import { X, Play, Download, Loader2, Volume2, Sliders } from 'lucide-react';
import { generateElevenLabsAudio, ELEVENLABS_MODELS, DEFAULT_VOICES, ElevenLabsSettings } from '../services/elevenLabsService';

interface AudioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
}

const AudioGeneratorModal: React.FC<AudioGeneratorModalProps> = ({ isOpen, onClose, initialText }) => {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICES[0].id);
  const [modelId, setModelId] = useState('eleven_multilingual_v2');
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [style, setStyle] = useState(0.0);
  const [speakerBoost, setSpeakerBoost] = useState(true);

  // Update text when prop changes
  useEffect(() => {
    if (isOpen) {
        setText(initialText);
        setAudioUrl(null); // Reset audio on open
        setError(null);
    }
  }, [isOpen, initialText]);

  const handleGenerate = async () => {
    if (!text.trim()) {
        setError("O texto não pode estar vazio.");
        return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    const settings: ElevenLabsSettings = {
        text,
        voiceId,
        modelId,
        stability,
        similarityBoost: similarity,
        style,
        useSpeakerBoost: speakerBoost
    };

    try {
        const audioBlob = await generateElevenLabsAudio(settings);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
    } catch (err: any) {
        setError(err.message || "Erro ao gerar áudio.");
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0f1115] w-full max-w-2xl rounded-xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#16191f]">
          <div className="flex items-center space-x-2">
            <Volume2 className="text-white" size={20} />
            <h2 className="text-lg font-semibold text-white">ElevenLabs Audio Studio</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Voice & Model Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Voz</label>
                    <div className="relative">
                        <select 
                            value={voiceId} 
                            onChange={(e) => setVoiceId(e.target.value)}
                            className="w-full bg-[#1c1f26] text-white border border-gray-700 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {DEFAULT_VOICES.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Modelo</label>
                    <div className="relative">
                        <select 
                            value={modelId} 
                            onChange={(e) => setModelId(e.target.value)}
                            className="w-full bg-[#1c1f26] text-white border border-gray-700 rounded-lg p-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {ELEVENLABS_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>
            </div>

            {/* Sliders Configuration */}
            <div className="space-y-6 bg-[#16191f] p-4 rounded-lg border border-gray-800">
                <div className="flex items-center space-x-2 mb-2">
                    <Sliders size={16} className="text-blue-400" />
                    <span className="text-sm font-semibold text-gray-300">Configurações de Voz</span>
                </div>

                {/* Estabilidade */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Estabilidade</span>
                        <span>{Math.round(stability * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-gray-500 uppercase">Mais Variável</span>
                        <input 
                            type="range" min="0" max="1" step="0.01" 
                            value={stability} 
                            onChange={(e) => setStability(parseFloat(e.target.value))}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <span className="text-[10px] text-gray-500 uppercase">Mais Estável</span>
                    </div>
                </div>

                {/* Similaridade */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Similaridade</span>
                        <span>{Math.round(similarity * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-gray-500 uppercase">Baixo</span>
                        <input 
                            type="range" min="0" max="1" step="0.01" 
                            value={similarity} 
                            onChange={(e) => setSimilarity(parseFloat(e.target.value))}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <span className="text-[10px] text-gray-500 uppercase">Alto</span>
                    </div>
                </div>

                 {/* Exagero de Estilo */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>Exagero de Estilo</span>
                        <span>{Math.round(style * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-gray-500 uppercase">Nenhum</span>
                        <input 
                            type="range" min="0" max="1" step="0.01" 
                            value={style} 
                            onChange={(e) => setStyle(parseFloat(e.target.value))}
                            className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <span className="text-[10px] text-gray-500 uppercase">Exagerado</span>
                    </div>
                </div>

                {/* Speaker Boost & Idioma */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-3">
                        <div 
                            onClick={() => setSpeakerBoost(!speakerBoost)}
                            className={`w-10 h-5 rounded-full flex items-center cursor-pointer p-1 transition-colors ${speakerBoost ? 'bg-white' : 'bg-gray-600'}`}
                        >
                            <div className={`bg-black w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${speakerBoost ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                        <span className="text-sm text-gray-300">Aumento de volume do alto-falante</span>
                    </div>
                </div>
            </div>

            {/* Text Input */}
            <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase font-semibold">Texto para fala</label>
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-32 bg-[#1c1f26] border border-gray-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500 resize-none font-mono leading-relaxed"
                    placeholder="Cole seu roteiro aqui..."
                />
            </div>
            
            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded text-red-400 text-sm">
                    {error}
                </div>
            )}
        </div>

        {/* Footer / Actions */}
        <div className="p-6 border-t border-gray-800 bg-[#16191f] flex flex-col sm:flex-row items-center justify-between gap-4">
             {audioUrl && (
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <audio controls src={audioUrl} className="h-10 w-full sm:w-60 rounded" />
                    <a 
                        href={audioUrl} 
                        download="audio-elevenlabs.mp3"
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        title="Baixar MP3"
                    >
                        <Download size={20} />
                    </a>
                </div>
             )}

             <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                 <button 
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                 >
                    Cancelar
                 </button>
                 <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all disabled:opacity-50 min-w-[140px]"
                 >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} fill="currentColor" />}
                    <span>{loading ? 'Gerando...' : 'Gerar Áudio'}</span>
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default AudioGeneratorModal;
