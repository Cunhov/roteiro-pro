
import React, { useState, useRef } from 'react';
import { Upload, FileText, X, TrendingUp, Loader2, Download, Copy, Check, Eye, User, MonitorPlay } from 'lucide-react';
import { LLMGateway } from '../services/llmGateway';
import { logger } from '../utils/logger';
import StepDisplay from './StepDisplay';
import { NICHE_STEPS, StrategyType } from '../types';
import {
    getNicheExtractionPrompt,
    getMarketAnalysisPrompt,
    getNicheReportPrompt,
    getDarkStrategyPrompt,
    getAuthorityStrategyPrompt
} from '../utils/prompts';

interface NicheAnalyzerProps {
    llmGateway: LLMGateway;
}

const NicheAnalyzer: React.FC<NicheAnalyzerProps> = ({ llmGateway }) => {
    const [inputText, setInputText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [results, setResults] = useState<string[]>([]);

    // State specific to the new flow
    const [marketJson, setMarketJson] = useState<string | null>(null);
    const [marketReport, setMarketReport] = useState<string | null>(null);
    const [strategyReport, setStrategyReport] = useState<string | null>(null);
    const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(null);

    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setInputText(event.target.result as string);
            }
        };
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
            reader.onload = (event) => {
                if (event.target?.result) {
                    setInputText(event.target.result as string);
                }
            };
            reader.readAsText(file);
        }
    };

    // Phase 1: Market Intelligence (Steps 1, 2, 3)
    const startMarketAnalysis = async () => {
        if (!inputText.trim()) return;

        setIsProcessing(true);
        setCurrentStep(1);
        setResults([]);
        setMarketReport(null);
        setStrategyReport(null);
        setMarketJson(null);
        setSelectedStrategy(null);
        setError(null);

        try {
            // Step 1: Extrator Hierárquico
            const p1 = getNicheExtractionPrompt(inputText);
            const r1 = await llmGateway.generateText(p1);
            setResults(prev => [...prev, r1]);
            setCurrentStep(2);

            // Step 2: Scanner de Mercado
            const p2 = getMarketAnalysisPrompt(r1);
            const r2 = await llmGateway.generateText(p2);
            setResults(prev => [...prev, r2]);
            setMarketJson(r2); // Save for phase 2
            setCurrentStep(3);

            // Step 3: Classificador Blue Ocean (Relatório de Mercado)
            const p3 = getNicheReportPrompt(r2);
            const r3 = await llmGateway.generateText(p3);
            setResults(prev => [...prev, r3]);
            setMarketReport(r3);

            // Pause here for user decision
            setIsProcessing(false);
            setCurrentStep(4);

        } catch (err: any) {
            logger.error("Market analysis failed", { error: err.message, stack: err.stack });
            setError(err.message || "Erro durante a análise de mercado. Verifique sua chave de API nas configurações.");
            setIsProcessing(false);
        }
    };

    // Phase 2: Strategy Generation (Step 4 based on choice)
    const generateStrategy = async (type: 'dark' | 'authority') => {
        if (!marketJson) return;

        setIsProcessing(true);
        setSelectedStrategy(type);

        try {
            const prompt = type === 'dark'
                ? getDarkStrategyPrompt(marketJson)
                : getAuthorityStrategyPrompt(marketJson);

            const report = await llmGateway.generateText(prompt);

            setResults(prev => [...prev, report]); // This is result index 3
            setStrategyReport(report);

            setIsProcessing(false);
            setCurrentStep(5); // Fully Complete

        } catch (err: any) {
            logger.error("Strategy generation failed", { error: err.message, stack: err.stack });
            setError(err.message || "Erro ao gerar estratégia.");
            setIsProcessing(false);
        }
    };

    const getFullContent = () => {
        return `${marketReport || ''}\n\n---\n\n${strategyReport || ''}`;
    };

    const handleCopy = () => {
        const content = getFullContent();
        if (content.trim()) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        const content = getFullContent();
        if (content.trim()) {
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio-completo-${Date.now()}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    // Basic print function
    const handlePrintPDF = () => {
        const content = getFullContent();
        if (!content.trim()) return;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (doc) {
            let html = content
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
                .replace(/\|(.+)\|/g, (match) => {
                    const cells = match.split('|').filter(c => c.trim());
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
                    h2 { color: #1e293b; font-size: 16px; margin-top: 25px; border-bottom: 1px solid #ddd; }
                    h3 { font-size: 14px; margin-top: 15px; font-weight: bold; color: #475569; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 10px; }
                    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
                    tr:nth-child(even) { background-color: #f9fafb; }
                    ul { margin: 10px 0; padding-left: 20px; }
                    li { margin-bottom: 5px; }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
          `);
            doc.close();
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
        }

        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    Inteligência de Nichos & Estratégia
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                    Descubra oportunidades "Oceano Azul" e gere estratégias personalizadas para canais Dark ou de Autoridade.
                </p>

                {/* Input Area */}
                <div className="space-y-4">
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="relative w-full group"
                    >
                        <div className="flex justify-between items-center mb-2 px-1">
                            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                                <FileText size={16} />
                                <span>Ideia Inicial, Transcrição ou Texto Base</span>
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
                            placeholder="Descreva seus interesses ou cole um texto. Ex: 'Gosto de história antiga e mistérios, mas não quero aparecer nos vídeos' ou 'Sou nutricionista e quero criar autoridade online'."
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
                            onClick={startMarketAnalysis}
                            disabled={!inputText.trim() || isProcessing || currentStep > 0}
                            className={`
                            px-6 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all
                            ${!inputText.trim() || isProcessing || currentStep > 0
                                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5'
                                }
                        `}
                        >
                            {isProcessing && currentStep < 4 ? <Loader2 className="animate-spin" /> : <TrendingUp />}
                            <span>{currentStep > 0 ? 'Análise Iniciada' : '1. Analisar Mercado'}</span>
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

            {/* Progress Display */}
            {(isProcessing || results.length > 0) && (
                <div className="space-y-6">

                    {/* Steps Visualizer */}
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Pipeline de Inteligência</h3>
                        <div className="space-y-2">
                            {NICHE_STEPS.map((step, index) => {
                                let status: 'idle' | 'processing' | 'completed' = 'idle';

                                // Logic for status
                                if (index < currentStep - 1) status = 'completed';
                                else if (index === currentStep - 1 && isProcessing) status = 'processing';
                                else if (step.id === 4 && strategyReport) status = 'completed';

                                // Logic for step 4 title based on choice
                                let title = step.title;
                                if (step.id === 4 && selectedStrategy === 'dark') title = 'Estratégia Dark Channel';
                                if (step.id === 4 && selectedStrategy === 'authority') title = 'Estratégia de Autoridade';

                                return (
                                    <StepDisplay
                                        key={step.id}
                                        step={{ ...step, title }}
                                        status={status}
                                        result={results[index]}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* DECISION POINT: STRATEGY SELECTION */}
                    {marketReport && !strategyReport && !isProcessing && (
                        <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-xl p-8 text-center animate-fade-in-up">
                            <h3 className="text-2xl font-bold text-white mb-2">Qual caminho você quer seguir?</h3>
                            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                                Com base na análise de mercado acima, selecione como você deseja executar o canal.
                            </p>

                            <div className="flex flex-col md:flex-row justify-center gap-6">
                                <button
                                    onClick={() => generateStrategy('dark')}
                                    className="group relative flex flex-col items-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500 rounded-xl transition-all w-full md:w-64"
                                >
                                    <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mb-4 text-purple-400 group-hover:text-purple-300">
                                        <MonitorPlay size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Canal Dark</h4>
                                    <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded mb-2">Faceless / Mistério</span>
                                    <p className="text-sm text-slate-400 text-center">
                                        Foco em narrativa, mistério e visuais sem aparecer. Estilo "Video Essay".
                                    </p>
                                </button>

                                <button
                                    onClick={() => generateStrategy('authority')}
                                    className="group relative flex flex-col items-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500 rounded-xl transition-all w-full md:w-64"
                                >
                                    <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-blue-400 group-hover:text-blue-300">
                                        <User size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">Canal Autoridade</h4>
                                    <span className="text-xs text-blue-300 bg-blue-900/30 px-2 py-1 rounded mb-2">Personal Brand</span>
                                    <p className="text-sm text-slate-400 text-center">
                                        Foco em conexão, confiança, didática e construção de marca pessoal.
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* FINAL CONSOLIDATED REPORT VIEW */}
                    {(marketReport || strategyReport) && (
                        <div className="bg-slate-950 border border-blue-900/30 rounded-xl p-8 shadow-2xl animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <span className="text-green-500">✓</span> Relatório de Inteligência
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
                                        onClick={handleDownload}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                                    >
                                        <Download size={16} />
                                        <span>MD</span>
                                    </button>
                                    <button
                                        onClick={handlePrintPDF}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm text-white font-medium transition-colors shadow-lg shadow-blue-900/20"
                                    >
                                        <FileText size={16} />
                                        <span>PDF</span>
                                    </button>
                                </div>
                            </div>

                            {/* Report Container */}
                            <div className="space-y-8">
                                {/* Market Section */}
                                {marketReport && (
                                    <div className="prose prose-invert max-w-none bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                                            <TrendingUp className="text-blue-500" />
                                            <h3 className="text-lg font-bold text-white m-0">Análise de Oportunidade</h3>
                                        </div>
                                        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                                            {marketReport}
                                        </div>
                                    </div>
                                )}

                                {/* Strategy Section */}
                                {strategyReport && (
                                    <div className="prose prose-invert max-w-none bg-slate-900/50 p-6 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
                                            <MonitorPlay className="text-purple-500" />
                                            <h3 className="text-lg font-bold text-white m-0">Plano de Execução ({selectedStrategy})</h3>
                                        </div>
                                        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-300">
                                            {strategyReport}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NicheAnalyzer;
