
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Circle, Loader2, ChevronRight, Copy, Check } from 'lucide-react';
import { StepDefinition } from '../types';

interface StepDisplayProps {
  step: StepDefinition;
  status: 'idle' | 'processing' | 'completed';
  result?: string;
}

const StepDisplay: React.FC<StepDisplayProps> = ({ step, status, result }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'completed' && contentRef.current) {
        // Auto scroll to latest completed step
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [status]);

  const handleCopy = () => {
    if (result) {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div ref={contentRef} className={`border border-slate-800 rounded-lg overflow-hidden mb-3 transition-all duration-500 ${status === 'processing' ? 'ring-2 ring-blue-500/50 bg-slate-800/30' : 'bg-slate-900'}`}>
      <div className="p-4 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center space-x-3">
          {status === 'completed' ? (
            <CheckCircle2 className="text-green-500" size={24} />
          ) : status === 'processing' ? (
            <Loader2 className="text-blue-500 animate-spin" size={24} />
          ) : (
            <Circle className="text-slate-600" size={24} />
          )}
          
          <div>
            <h3 className={`font-medium ${status === 'idle' ? 'text-slate-500' : 'text-slate-200'}`}>
              Etapa {step.id}: {step.title}
            </h3>
            <p className="text-xs text-slate-500">{step.description}</p>
          </div>
        </div>
      </div>

      {/* Output Preview Area */}
      {result && (
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 animate-fade-in relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center">
                <ChevronRight size={12} className="mr-1" /> Resultado da Etapa
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-600 font-mono">{result.length} chars</span>
                <button 
                    onClick={handleCopy}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center space-x-1 text-xs"
                    title="Copiar resultado desta etapa"
                >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
            </div>
          </div>
          
          <div className="text-slate-300 text-sm leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap font-mono bg-slate-950 p-3 rounded">
            {result.length > 500 ? result.substring(0, 500) + '...' : result}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepDisplay;
