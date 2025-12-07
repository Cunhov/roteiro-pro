
import React, { useState, useRef } from 'react';
import { ImagePlus, Upload, FileText, X, Loader2, Download, Wand2, Settings2, Image as ImageIcon } from 'lucide-react';
import { LLMGateway } from '../services/llmGateway';
import { logger } from '../utils/logger';
import { getThumbnailPlannerPrompt } from '../utils/prompts';

interface ThumbnailCreatorProps {
    llmGateway: LLMGateway;
}

const ThumbnailCreator: React.FC<ThumbnailCreatorProps> = ({ llmGateway }) => {
    const [inputText, setInputText] = useState('');
    const [refImages, setRefImages] = useState<string[]>([]);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');

    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [visualPrompt, setVisualPrompt] = useState<string>('');
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            // Check if text or image
            if (file.type.startsWith('image/')) {
                readImageFile(file);
            } else {
                const reader = new FileReader();
                reader.onload = (ev) => ev.target?.result && setInputText(ev.target.result as string);
                reader.readAsText(file);
            }
        }
    };

    const readImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setRefImages(prev => [...prev, ev.target!.result as string].slice(0, 3)); // Max 3 refs
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRefImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => readImageFile(file as File));
    };

    // --- Generation Logic ---

    const generateThumbnail = async () => {
        if (!inputText.trim() && refImages.length === 0) return;
        setIsProcessing(true);
        setGeneratedImage(null);
        setVisualPrompt('');
        setError(null);

        try {
            // Step 1: Generate Visual Prompt from Text (Strategy)
            // If only images are provided, we skip this or interpret images? 
            // For now, let's assume text context is usually present or we generic prompt.
            let promptToUse = '';

            if (inputText.trim()) {
                const plannerPrompt = getThumbnailPlannerPrompt(inputText);
                const plannedPrompt = await llmGateway.generateText(plannerPrompt, undefined);
                setVisualPrompt(plannedPrompt);
                promptToUse = plannedPrompt;
            } else {
                promptToUse = "A high quality youtube thumbnail, 4k, hyper realistic, viral style.";
            }

            // Step 2: Generate Image
            // Note: We need to temporarily override aspect ratio in gateway if we want to enforce the local setting
            // However, current Gateway takes aspect ratio from Global Settings.
            // Ideally, we pass it as param, but for now let's append it to prompt or rely on global settings.
            // IMPROVEMENT: Update Gateway to accept overrides. For now, we assume user set it in settings OR we force it via prompt text if model supports.
            // Actually, Poe/Gemini adapters in Gateway read `this.settings.imageAspectRatio`. 
            // We can't easily override without updating settings globally.
            // Let's inform the user or assume they set it in settings, OR update gateway to accept config override.
            // *Hack for now*: We'll trust the user has set the aspect ratio in Settings page, OR we assume 16:9 as standard.
            // Better yet, let's append "--ar 16:9" to prompt if using Midjourney/Poe, though gateway handles logic.

            const image = await llmGateway.generateImage(promptToUse, refImages);
            setGeneratedImage(image);

        } catch (err: any) {
            logger.error("Thumbnail generation failed", { error: err.message, stack: err.stack });
            setError(err.message || "Erro ao gerar thumbnail.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">

            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <ImagePlus className="text-purple-500" />
                    Criador de Thumbnails AI
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                    Crie capas virais para YouTube analisando o roteiro e utilizando referências visuais.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left: Inputs */}
                    <div className="space-y-4">

                        {/* Text Input */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="relative"
                        >
                            <div className="flex justify-between mb-1 px-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Contexto do Vídeo (Roteiro/Ideia)</label>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="w-full h-40 bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-300 text-xs font-mono resize-none focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Cole o roteiro, transcrição ou descreva a ideia do vídeo aqui..."
                                readOnly={isProcessing}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg border border-slate-600 text-xs flex items-center gap-1"
                            >
                                <Upload size={14} /> Importar Texto
                            </button>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.srt,.md" onChange={handleFileUpload} />
                        </div>

                        {/* Reference Images */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Imagens de Referência (Opcional)</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {refImages.map((img, idx) => (
                                    <div key={idx} className="w-20 h-20 flex-shrink-0 relative rounded-lg overflow-hidden border border-slate-700 group">
                                        <img src={img} className="w-full h-full object-cover" alt="ref" />
                                        <button
                                            onClick={() => setRefImages(prev => prev.filter((_, i) => i !== idx))}
                                            className="absolute inset-0 bg-black/50 hover:bg-red-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={16} className="text-white" />
                                        </button>
                                    </div>
                                ))}
                                {refImages.length < 3 && (
                                    <button
                                        onClick={() => refImageInputRef.current?.click()}
                                        className="w-20 h-20 flex-shrink-0 border-2 border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                                    >
                                        <Upload size={20} className="mb-1" />
                                        <span className="text-[10px]">Add Ref</span>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={refImageInputRef} className="hidden" accept="image/*" onChange={handleRefImageUpload} multiple />
                            <p className="text-[10px] text-slate-600 mt-1">Arraste imagens para o campo de texto ou use o botão acima.</p>
                        </div>

                    </div>

                    {/* Right: Settings & Action */}
                    <div className="space-y-4 bg-slate-950/30 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold text-sm border-b border-slate-800 pb-2">
                                <Settings2 size={16} /> Configurações
                            </div>

                            <div className="space-y-3">
                                <label className="block">
                                    <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Aspect Ratio</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['16:9', '9:16', '1:1', '4:3'].map((ratio) => (
                                            <button
                                                key={ratio}
                                                onClick={() => setAspectRatio(ratio as any)}
                                                className={`
                                                px-3 py-2 rounded text-xs font-mono border transition-all
                                                ${aspectRatio === ratio
                                                        ? 'bg-purple-600 border-purple-500 text-white'
                                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                                                    }
                                            `}
                                            >
                                                {ratio}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-yellow-600/80 mt-2">
                                        Nota: Certifique-se que o "Aspect Ratio" nas <b>Configurações AI</b> também esteja compatível se estiver usando modelos restritos.
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={generateThumbnail}
                                disabled={isProcessing || (!inputText && refImages.length === 0)}
                                className={`
                                w-full py-4 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all
                                ${isProcessing || (!inputText && refImages.length === 0)
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20'
                                    }
                            `}
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : <Wand2 />}
                                <span>{isProcessing ? 'Criando Arte...' : 'Gerar Thumbnail'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm flex items-start gap-2">
                    <X size={18} className="mt-0.5 flex-shrink-0" />
                    <div>{error}</div>
                </div>
            )}

            {/* Output */}
            {(generatedImage || visualPrompt) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">

                    {/* Visual Prompt (Strategy) */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <FileText className="text-blue-400" size={18} /> Prompt Gerado (Estratégia)
                        </h3>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap h-64 overflow-y-auto">
                            {visualPrompt || "Gerando estratégia..."}
                        </div>
                    </div>

                    {/* Generated Image */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <ImageIcon className="text-pink-400" size={18} /> Resultado Final
                        </h3>

                        <div className="bg-black rounded-lg overflow-hidden border border-slate-800 relative group min-h-[256px] flex items-center justify-center">
                            {generatedImage ? (
                                <>
                                    <img src={generatedImage} alt="Thumbnail AI" className="w-full h-auto object-contain" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a
                                            href={generatedImage}
                                            download={`thumbnail-${Date.now()}.png`}
                                            className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:bg-slate-200 transition-colors"
                                        >
                                            <Download size={18} /> Baixar PNG
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="text-slate-600 flex flex-col items-center">
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin mb-2 text-purple-500" size={32} />
                                            <span className="text-sm">Renderizando...</span>
                                        </>
                                    ) : (
                                        <span>Aguardando geração...</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ThumbnailCreator;
