
import React, { useState, useRef } from 'react';
import { Lightbulb, Upload, FileText, X, Loader2, Download, Copy, Check, FileCode } from 'lucide-react';
import { LLMGateway } from '../services/llmGateway';
import { logger } from '../utils/logger';
import { getThemeCreatorPrompt } from '../utils/prompts';

interface ThemeCreatorProps {
    llmGateway?: LLMGateway; // Optional for backward compatibility, but recommended
}

const ThemeCreator: React.FC<ThemeCreatorProps> = ({ llmGateway }) => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        readFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) readFile(file);
    };

    const readFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setInputText(event.target.result as string);
            }
        };
        reader.readAsText(file);
    };

    const generateThemes = async () => {
        if (!inputText.trim()) return;
        if (!llmGateway) {
            setError("Gateway de IA não inicializado. Recarregue a página.");
            return;
        }

        setIsProcessing(true);
        setResult(null);
        setError(null);

        try {
            const prompt = getThemeCreatorPrompt(inputText);
            // Use text provider from settings via gateway
            const generatedText = await llmGateway.generateText(prompt);
            setResult(generatedText);
        } catch (err: any) {
            logger.error("Theme generation failed", { error: err.message, stack: err.stack });
            setError(err.message || "Erro ao gerar temas.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopy = () => {
        if (result) {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = (type: 'md' | 'txt' | 'pdf') => {
        if (!result) return;

        if (type === 'pdf') {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                let html = result
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/\|(.+)\|/g, (match) => {
                        const cells = match.split('|').filter(c => c.trim());
                        if (match.includes('---')) return '';
                        return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
                    })
                    .replace(/(<tr>.*?<\/tr>)/gs, '<table>$1</table>')
                    .replace(/\n/gim, '<br>');

                doc.open();
                doc.write(`
                <html>
                <head>
                    <style>
                        body { font-family: sans-serif; padding: 20px; color: #000; font-size: 12px; }
                        h1 { color: #2563eb; font-size: 20px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        tr:nth-child(even) { background-color: #f9fafb; }
                        tr:first-child { font-weight: bold; background-color: #e2e8f0; }
                    </style>
                </head>
                <body>
                    <h1>30 Ideias de Vídeos</h1>
                    ${html}
                </body>
                </html>
            `);
                doc.close();
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }
            return;
        }

        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `temas-videos-${Date.now()}.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500" />
                    Criador de Temas Massivo
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                    Gere 30 ideias de vídeos instantaneamente com base em transcrições, notas ou análises de mercado.
                </p>

                <div className="space-y-4">
                    <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={handleDrop}
                        className="relative w-full group"
                    >
                        <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <FileText size={16} />
                                <span>Contexto (Temas, Títulos, Transcrições...)</span>
                            </label>

                            <div className="flex items-center gap-2">
                                {inputText && (
                                    <button
                                        onClick={() => setInputText('')}
                                        className="text-xs text-red-400 hover:text-red-300 underline"
                                    >
                                        Limpar
                                    </button>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center space-x-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded text-xs border border-slate-700 transition-colors"
                                >
                                    <Upload size={12} />
                                    <span>Importar Arquivo</span>
                                </button>
                            </div>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            readOnly={isProcessing}
                            className={`
                            w-full h-40 bg-slate-950/50 border rounded-lg p-4 text-slate-300 
                            resize-none font-mono text-sm placeholder:text-slate-600 transition-all
                            ${isProcessing ? 'border-slate-800 opacity-75 cursor-not-allowed' : 'border-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none focus:border-transparent'}
                        `}
                            placeholder="Cole aqui ideias soltas, resumos de canais, transcrições de vídeos virais ou relatórios de nicho..."
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".txt,.md,.srt"
                            onChange={handleFileUpload}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={generateThemes}
                            disabled={!inputText.trim() || isProcessing}
                            className={`
                            px-6 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all
                            ${!inputText.trim() || isProcessing
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-orange-900/20 transform hover:-translate-y-0.5'
                                }
                        `}
                        >
                            {isProcessing ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                            <span>{isProcessing ? 'Gerando Ideias...' : 'Gerar 30 Ideias'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm flex items-start gap-2">
                    <X size={18} className="mt-0.5 flex-shrink-0" />
                    <div className="whitespace-pre-wrap">{error}</div>
                </div>
            )}

            {result && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 shadow-2xl animate-fade-in-up">
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="text-green-500">✓</span> 30 Ideias Geradas
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                                <span>Copiar</span>
                            </button>
                            <button
                                onClick={() => handleDownload('md')}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                            >
                                <FileCode size={16} />
                                <span>MD</span>
                            </button>
                            <button
                                onClick={() => handleDownload('txt')}
                                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                            >
                                <FileText size={16} />
                                <span>TXT</span>
                            </button>
                            <button
                                onClick={() => handleDownload('pdf')}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-medium transition-colors shadow-lg shadow-blue-900/20"
                            >
                                <Download size={16} />
                                <span>PDF</span>
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="prose prose-invert max-w-none bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300 leading-relaxed">
                                {result}
                            </pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeCreator;
