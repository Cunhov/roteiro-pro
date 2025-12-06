
import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, X, User, MonitorPlay, ChevronDown, ChevronUp } from 'lucide-react';
import { ScriptConfiguration, ChannelType } from '../types';

interface InputSectionProps {
  config: ScriptConfiguration;
  setConfig: React.Dispatch<React.SetStateAction<ScriptConfiguration>>;
  onStart: () => void;
  disabled: boolean;
}

const LANGUAGES = [
  "Português (Brasil)",
  "Inglês (EUA)",
  "Espanhol (Latino)",
  "Espanhol (Espanha)",
  "Francês",
  "Alemão"
];

const InputSection: React.FC<InputSectionProps> = ({
  config,
  setConfig,
  onStart,
  disabled
}) => {
  const [dragActiveField, setDragActiveField] = useState<'transcription' | 'cover' | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(true);
  
  const transInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof ScriptConfiguration, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // Drag Handlers
  const handleDrag = (e: React.DragEvent, field: 'transcription' | 'cover', active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) setDragActiveField(field);
    else if (dragActiveField === field) setDragActiveField(null);
  };

  const handleDrop = (e: React.DragEvent, field: 'transcription' | 'cover') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveField(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (field === 'transcription') readTranscription(file);
      if (field === 'cover') readCover(file);
    }
  };

  const readTranscription = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) updateField('transcription', e.target.result as string);
    };
    reader.readAsText(file);
  };

  const readCover = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Apenas arquivos de imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) updateField('videoCover', e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isReady = config.topic.trim().length > 0 || config.transcription.trim().length > 0 || config.videoCover !== null;

  const CharCount = ({ text }: { text: string }) => (
    <span className="text-[10px] text-slate-500 font-mono float-right mt-1">
      {text.length} chars
    </span>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. CHANNEL TYPE SELECTOR */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => updateField('channelType', 'authority')}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            config.channelType === 'authority' 
              ? 'bg-blue-600/20 border-blue-500 text-white' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
          disabled={disabled}
        >
          <User size={32} className="mb-2" />
          <span className="font-bold">Canal de Autoridade</span>
          <span className="text-xs opacity-75 mt-1">Com Rosto / Expert</span>
        </button>

        <button
          onClick={() => updateField('channelType', 'dark')}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
            config.channelType === 'dark' 
              ? 'bg-purple-600/20 border-purple-500 text-white' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
          }`}
          disabled={disabled}
        >
          <MonitorPlay size={32} className="mb-2" />
          <span className="font-bold">Canal Dark</span>
          <span className="text-xs opacity-75 mt-1">Faceless / Narrativo</span>
        </button>
      </div>

      {/* 2. MAIN INPUTS (TOPIC & FILES) */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center">
          <FileText size={16} className="mr-2" /> 
          Conteúdo Base
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Tema do Vídeo</label>
            <input
              type="text"
              value={config.topic}
              onChange={(e) => updateField('topic', e.target.value)}
              placeholder="Ex: Como ganhar massa muscular rápido..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={disabled}
            />
            <CharCount text={config.topic} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {/* Transcription Dropzone */}
            <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Transcrição / Texto Base</label>
               {config.transcription ? (
                 <div className="relative w-full bg-slate-950 border border-slate-700 rounded-lg p-3 h-32">
                    <button 
                      onClick={() => updateField('transcription', '')}
                      className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-red-900 text-slate-400 hover:text-red-200 rounded transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <textarea
                      value={config.transcription}
                      onChange={(e) => updateField('transcription', e.target.value)}
                      className="w-full h-full bg-transparent text-slate-300 text-xs resize-none focus:outline-none"
                      disabled={disabled}
                    />
                 </div>
               ) : (
                 <div
                   onClick={() => transInputRef.current?.click()}
                   onDragOver={(e) => handleDrag(e, 'transcription', true)}
                   onDragLeave={(e) => handleDrag(e, 'transcription', false)}
                   onDrop={(e) => handleDrop(e, 'transcription')}
                   className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                     dragActiveField === 'transcription' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                   }`}
                 >
                   <input type="file" ref={transInputRef} onChange={(e) => e.target.files?.[0] && readTranscription(e.target.files[0])} className="hidden" accept=".txt,.md" />
                   <FileText className="text-slate-500 mb-2" />
                   <span className="text-xs text-slate-400">Arraste Texto (.txt)</span>
                 </div>
               )}
               {config.transcription && <CharCount text={config.transcription} />}
            </div>

            {/* Cover Dropzone */}
            <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Capa / Thumbnail</label>
               {config.videoCover ? (
                 <div className="relative w-full bg-slate-950 border border-slate-700 rounded-lg h-32 flex items-center justify-center overflow-hidden">
                    <button 
                      onClick={() => updateField('videoCover', null)}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full z-10"
                    >
                      <X size={14} />
                    </button>
                    <img src={config.videoCover} alt="Cover" className="h-full object-contain" />
                 </div>
               ) : (
                 <div
                   onClick={() => coverInputRef.current?.click()}
                   onDragOver={(e) => handleDrag(e, 'cover', true)}
                   onDragLeave={(e) => handleDrag(e, 'cover', false)}
                   onDrop={(e) => handleDrop(e, 'cover')}
                   className={`h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                     dragActiveField === 'cover' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                   }`}
                 >
                   <input type="file" ref={coverInputRef} onChange={(e) => e.target.files?.[0] && readCover(e.target.files[0])} className="hidden" accept="image/*" />
                   <ImageIcon className="text-slate-500 mb-2" />
                   <span className="text-xs text-slate-400">Arraste Imagem</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC CONFIGURATION FORM */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
           <h3 className="text-sm font-bold text-slate-300 flex items-center">
             <span className="mr-2">{config.channelType === 'authority' ? '👤' : '🕵️'}</span>
             Configurações do Canal {config.channelType === 'authority' ? 'de Autoridade' : 'Dark'}
           </h3>
           {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showAdvanced && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="label-text">Nome do Canal</label>
                <input 
                  type="text" 
                  value={config.channelName}
                  onChange={(e) => updateField('channelName', e.target.value)}
                  className="input-field" 
                  placeholder={config.channelType === 'authority' ? "Ex: Treino Ultra" : "Ex: Mistérios Ocultos"}
                />
              </div>

              {config.channelType === 'authority' && (
                <div>
                  <label className="label-text">Nome do Narrador/Expert</label>
                  <input 
                    type="text" 
                    value={config.narratorName}
                    onChange={(e) => updateField('narratorName', e.target.value)}
                    className="input-field" 
                    placeholder="Ex: Daniel Cunha"
                  />
                </div>
              )}

              <div>
                <label className="label-text">Idioma & Cultura</label>
                <select 
                  value={config.targetLanguage}
                  onChange={(e) => updateField('targetLanguage', e.target.value)}
                  className="input-field"
                >
                  {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>

              <div>
                 <label className="label-text">Estilo do Roteiro</label>
                 <input 
                    type="text"
                    value={config.scriptStyle}
                    onChange={(e) => updateField('scriptStyle', e.target.value)}
                    className="input-field"
                    placeholder={config.channelType === 'authority' ? "Ex: Motivador, Técnico, Informal" : "Ex: Misterioso, Dramático, Investigativo"}
                 />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
               <div>
                  <label className="label-text">Duração Estimada</label>
                  <select 
                    value={config.videoLength}
                    onChange={(e) => updateField('videoLength', e.target.value)}
                    className="input-field"
                  >
                    <option value="5-8 minutos">Curto (5-8 min)</option>
                    <option value="8-12 minutos">Padrão (8-12 min)</option>
                    <option value="12-20 minutos">Longo (12-20 min)</option>
                    <option value="Documentário (+20 min)">Documentário (+20 min)</option>
                  </select>
               </div>

               <div>
                  <label className="label-text flex justify-between">
                     <span>Produto / Infoproduto (Mid-Roll)</span>
                     <span className="text-[10px] text-blue-400 bg-blue-900/20 px-1 rounded">CTA Vendas</span>
                  </label>
                  <textarea 
                    value={config.productCTA}
                    onChange={(e) => updateField('productCTA', e.target.value)}
                    className="input-field h-20 resize-none"
                    placeholder="Resumo do produto. Ex: 'BIOLIFT - Treino completo por R$97. Link na bio.'"
                  />
                  <CharCount text={config.productCTA} />
               </div>

               <div>
                  <label className="label-text flex justify-between">
                     <span>Patrocínio / Cupom (End-Roll)</span>
                     <span className="text-[10px] text-green-400 bg-green-900/20 px-1 rounded">Patrocinador</span>
                  </label>
                  <textarea 
                    value={config.sponsorCTA}
                    onChange={(e) => updateField('sponsorCTA', e.target.value)}
                    className="input-field h-20 resize-none"
                    placeholder="Ex: 'Growth Supplements, use cupom CUNHA para 10% de desconto.'"
                  />
                  <CharCount text={config.sponsorCTA} />
               </div>
            </div>

          </div>
        )}
      </div>

      {/* START ACTION */}
      <button
          onClick={onStart}
          disabled={!isReady || disabled}
          className={`
            w-full py-4 rounded-lg font-bold text-lg shadow-lg transform transition-all duration-200 mt-4
            ${isReady && !disabled
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white scale-[1.01]' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }
          `}
      >
          {disabled ? 'Gerando Roteiro...' : `GERAR ROTEIRO ${config.channelType === 'authority' ? 'DE AUTORIDADE' : 'DARK'}`}
      </button>

      <style>{`
        .label-text { display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 0.25rem; text-transform: uppercase; }
        .input-field { width: 100%; background-color: #020617; border: 1px solid #1e293b; border-radius: 0.5rem; padding: 0.75rem; color: #cbd5e1; font-size: 0.875rem; transition: all; }
        .input-field:focus { outline: none; border-color: #3b82f6; ring: 2px solid rgba(59, 130, 246, 0.5); }
      `}</style>
    </div>
  );
};

export default InputSection;
