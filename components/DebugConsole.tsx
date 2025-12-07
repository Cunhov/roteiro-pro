import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Minimize2, Maximize2, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface LogEntry {
    id: string;
    timestamp: Date;
    level: 'info' | 'warn' | 'error';
    message: string;
    details?: any;
}

interface DebugConsoleProps {
    logs: LogEntry[];
    onClear: () => void;
}

const DebugConsole: React.FC<DebugConsoleProps> = ({ logs, onClear }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isExpanded && !isMinimized) {
            logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isExpanded, isMinimized]);

    const copyToClipboard = () => {
        const logText = logs.map(log =>
            `[${log.timestamp.toLocaleTimeString()}] [${log.level.toUpperCase()}] ${log.message}${log.details ? '\nDetalhes: ' + JSON.stringify(log.details, null, 2) : ''
            }`
        ).join('\n\n');

        navigator.clipboard.writeText(logText);
        alert('Logs copiados para a área de transferência!');
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'error': return <AlertCircle size={14} className="text-red-400" />;
            case 'warn': return <AlertTriangle size={14} className="text-yellow-400" />;
            case 'info': return <Info size={14} className="text-blue-400" />;
            default: return null;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error': return 'text-red-300 bg-red-900/20 border-red-800';
            case 'warn': return 'text-yellow-300 bg-yellow-900/20 border-yellow-800';
            case 'info': return 'text-blue-300 bg-blue-900/20 border-blue-800';
            default: return 'text-slate-300 bg-slate-900/20 border-slate-800';
        }
    };

    if (isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg"
                >
                    <Terminal size={16} />
                    <span className="text-xs font-mono">Debug Console</span>
                    {logs.filter(l => l.level === 'error').length > 0 && (
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {logs.filter(l => l.level === 'error').length}
                        </span>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 bg-slate-950 border border-slate-700 rounded-lg shadow-2xl transition-all duration-300 ${isExpanded ? 'w-[600px] h-[500px]' : 'w-[400px] h-[300px]'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-green-400" />
                    <h3 className="text-sm font-bold text-white font-mono">Debug Console</h3>
                    <span className="text-xs text-slate-500">({logs.length} logs)</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={copyToClipboard}
                        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title="Copiar logs"
                    >
                        <Copy size={14} />
                    </button>
                    <button
                        onClick={onClear}
                        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title="Limpar logs"
                    >
                        <X size={14} />
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title={isExpanded ? 'Minimizar' : 'Expandir'}
                    >
                        {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                        title="Esconder"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Logs Content */}
            <div className="overflow-y-auto h-[calc(100%-48px)] p-3 space-y-2 font-mono text-xs">
                {logs.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                        <Terminal size={32} className="mx-auto mb-2 opacity-50" />
                        <p>Nenhum log ainda</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div
                            key={log.id}
                            className={`p-2 rounded border ${getLevelColor(log.level)}`}
                        >
                            <div className="flex items-start gap-2 mb-1">
                                {getLevelIcon(log.level)}
                                <span className="text-slate-500 text-[10px]">
                                    {log.timestamp.toLocaleTimeString()}
                                </span>
                                <span className="uppercase font-bold text-[10px]">
                                    {log.level}
                                </span>
                            </div>
                            <p className="ml-5 whitespace-pre-wrap break-words">{log.message}</p>
                            {log.details && (
                                <details className="ml-5 mt-1">
                                    <summary className="cursor-pointer text-slate-500 hover:text-slate-300 text-[10px]">
                                        Ver detalhes
                                    </summary>
                                    <pre className="mt-1 p-2 bg-black/30 rounded text-[10px] overflow-x-auto">
                                        {typeof log.details === 'string'
                                            ? log.details
                                            : JSON.stringify(log.details, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </div>
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default DebugConsole;
