
import React, { useState, useEffect } from 'react';
import { Film, RefreshCw, AlertTriangle, Download, RotateCcw, Volume2, Copy, Check, FileText } from 'lucide-react';
import Sidebar from './components/Sidebar';
import NicheAnalyzer from './components/NicheAnalyzer';
import ThemeCreator from './components/ThemeCreator';
import BRollCreator from './components/BRollCreator';
import TitleDescriptionGenerator from './components/TitleDescriptionGenerator';
import ThumbnailCreator from './components/ThumbnailCreator';
import Settings from './components/Settings';
import InputSection from './components/InputSection';
import StepDisplay from './components/StepDisplay';
import AudioGeneratorModal from './components/AudioGeneratorModal';
import { PROCESSING_STEPS, ScriptState, ScriptConfiguration, AppView, DEFAULT_LLM_SETTINGS, LLMSettings } from './types';
import { LLMGateway } from './services/llmGateway';
import { loadSettingsFromStorage, saveSettingsToStorage } from './services/storageService';
import { GeradorRoteiroJSON, ValidadorRoteiro } from './utils/validators';
import { 
  getStep1Prompt, 
  getStep2Prompt, 
  getStep3Prompt, 
  getStep4Prompt, 
  getStep5Prompt, 
  getStep6Prompt, 
  getStep7Prompt,
  getPromptFix
} from './utils/prompts';

const INITIAL_CONFIG: ScriptConfiguration = {
    channelType: 'authority',
    topic: '',
    transcription: '',
    videoCover: null,
    channelName: '',
    narratorName: '',
    productCTA: '',
    sponsorCTA: '',
    scriptStyle: '',
    videoLength: '8-12 minutos',
    targetLanguage: 'Português (Brasil)'
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('script-generator');
  const [copied, setCopied] = useState(false);

  // --- LLM CONFIG ---
  const [llmSettings, setLlmSettings] = useState<LLMSettings>(DEFAULT_LLM_SETTINGS);
  const [llmGateway] = useState(() => new LLMGateway(DEFAULT_LLM_SETTINGS));

  // Load Settings on Mount
  useEffect(() => {
    const savedSettings = loadSettingsFromStorage();
    setLlmSettings(savedSettings);
    llmGateway.updateSettings(savedSettings);
  }, []); // Run once

  const handleSettingsSave = (newSettings: LLMSettings) => {
    setLlmSettings(newSettings);
    saveSettingsToStorage(newSettings); // Persist
    llmGateway.updateSettings(newSettings);
    setActiveView('script-generator');
  };

  // --- SCRIPT STATE ---
  const [scriptState, setScriptState] = useState<ScriptState>({
    config: INITIAL_CONFIG,
    currentStep: 0,
    results: [],
    isProcessing: false,
    isComplete: false,
    error: null,
    finalJson: null
  });

  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioInitialText, setAudioInitialText] = useState('');

  const updateConfig = (newConfig: React.SetStateAction<ScriptConfiguration>) => {
      if (typeof newConfig === 'function') {
          setScriptState(prev => ({ ...prev, config: newConfig(prev.config) }));
      } else {
          setScriptState(prev => ({ ...prev, config: newConfig }));
      }
  };

  const runPipeline = async () => {
    setScriptState(prev => ({ 
        ...prev, 
        isProcessing: true, 
        currentStep: 1, 
        results: [], 
        error: null, 
        isComplete: false,
        finalJson: null 
    }));

    try {
        const { config } = scriptState;

        // Step 1: Strategy & Structure
        const r1 = await llmGateway.generateText(getStep1Prompt(config));
        updateResult(1, r1);

        // Step 2: Introduction
        const r2 = await llmGateway.generateText(getStep2Prompt(config, r1));
        updateResult(2, r2);

        // Step 3: Development
        const r3 = await llmGateway.generateText(getStep3Prompt(config, r1));
        updateResult(3, r3);

        // Step 4: Product Integration (Mid-Roll)
        const r4 = await llmGateway.generateText(getStep4Prompt(config, r2, r3));
        updateResult(4, r4);

        // Step 5: Sponsor & Outro
        const r5 = await llmGateway.generateText(getStep5Prompt(config, r4));
        updateResult(5, r5);

        // Step 6: Audit
        let auditScript = r5;
        const r6 = await llmGateway.generateText(getStep6Prompt(config, r5));
        
        if (r6.length > r5.length * 0.5 && !r6.includes("APROVADO")) {
            auditScript = r6;
        }
        
        // Auto-Correction Loop
        const validador = new ValidadorRoteiro();
        let attempts = 0;
        let audit = validador.auditarCompleto(auditScript);

        while (!audit.aprovado && attempts < 2) {
             attempts++;
             setScriptState(prev => ({
                 ...prev,
                 results: [...prev.results, `⚠️ Auto-Correção de Conteúdo ${attempts}...`]
             }));

             const fixedScript = await llmGateway.generateText(getPromptFix(auditScript, audit.erros));
             auditScript = fixedScript;
             audit = validador.auditarCompleto(auditScript);
        }
        updateResult(6, r6 + (attempts > 0 ? `\n[Corrigido ${attempts}x]` : ""));

        // Step 7: Normalization SSML
        const r7 = await llmGateway.generateText(getStep7Prompt(config, auditScript));
        updateResult(7, r7);

        // Generate JSON
        const generator = new GeradorRoteiroJSON();
        const json = generator.gerarJSON(config.topic || "Tema Gerado", r7, {
            apresentador: config.narratorName,
            canal: config.channelName,
            idioma: config.targetLanguage
        });
        
        setScriptState(prev => ({ 
            ...prev, 
            isProcessing: false, 
            isComplete: true,
            finalJson: json 
        }));

    } catch (err: any) {
        setScriptState(prev => ({ 
            ...prev, 
            isProcessing: false, 
            error: err.message || "Erro desconhecido." 
        }));
    }
  };

  const updateResult = (stepId: number, result: string) => {
    setScriptState(prev => ({
        ...prev,
        currentStep: stepId + 1,
        results: [...prev.results, result]
    }));
  };

  const handleCopyScript = () => {
    if (scriptState.finalJson) {
      navigator.clipboard.writeText(scriptState.finalJson.conteudo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintPDF = () => {
      const content = scriptState.finalJson?.conteudo;
      if (!content) return;
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (doc) {
          let html = content.replace(/\n/g, '<br>').replace(/<break time=".*?">/g, '<span style="color: #64748b; font-size: 0.8em;">$&</span>');
          doc.open();
          doc.write(`<html><body><h1>Roteiro</h1>${html}</body></html>`);
          doc.close();
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
      }
      setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  const openAudioWithScript = () => {
    if (scriptState.finalJson) {
        setAudioInitialText(scriptState.finalJson.conteudo);
        setIsAudioModalOpen(true);
    }
  };

  const getPageTitle = () => {
      switch (activeView) {
          case 'script-generator': return 'Gerador de Roteiro';
          case 'niche-analyzer': return 'Analisador de Nichos';
          case 'theme-creator': return 'Criador de Temas';
          case 'title-description': return 'Título & Descrição';
          case 'broll-creator': return 'B-Roll Creator';
          case 'thumbnail-creator': return 'Criador de Thumbnail';
          case 'settings': return 'Configurações do Sistema';
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        disabled={scriptState.isProcessing} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="h-16 border-b border-slate-800 bg-slate-950 flex items-center px-6 justify-between flex-shrink-0">
             <h2 className="text-lg font-semibold text-white">
                {getPageTitle()}
             </h2>
             <div className="flex gap-2 text-xs font-mono text-slate-500">
                 <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-blue-400 uppercase">{llmSettings.textProvider} (Text)</span>
                 <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800 text-pink-400 uppercase">{llmSettings.imageProvider} (Img)</span>
             </div>
          </div>

          <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
            
            {/* VIEW 1: SCRIPT GENERATOR */}
            <div className={activeView === 'script-generator' ? 'block' : 'hidden'}>
                {scriptState.error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center text-red-200">
                        <AlertTriangle className="mr-3" size={20} />
                        <p>{scriptState.error}</p>
                    </div>
                )}

                {!scriptState.isProcessing && !scriptState.isComplete && (
                  <InputSection 
                    config={scriptState.config}
                    setConfig={updateConfig}
                    onStart={runPipeline}
                    disabled={scriptState.isProcessing}
                  />
                )}

                {(scriptState.isProcessing || scriptState.isComplete) && (
                <div className="space-y-6">
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-white">Pipeline</h2>
                            <div className="text-sm text-slate-400">{scriptState.isComplete ? 'Concluído' : 'Processando...'}</div>
                        </div>
                        <div className="space-y-2">
                            {PROCESSING_STEPS.map((step, index) => (
                                <StepDisplay 
                                    key={step.id} 
                                    step={step} 
                                    status={index < scriptState.currentStep - 1 ? 'completed' : (index === scriptState.currentStep - 1 && scriptState.isProcessing ? 'processing' : 'idle')}
                                    result={scriptState.results[index]}
                                />
                            ))}
                        </div>
                    </div>
                    {scriptState.isComplete && scriptState.finalJson && (
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                           <div className="flex justify-between mb-4">
                              <h3 className="font-bold text-white">Roteiro Final</h3>
                              <div className="flex gap-2">
                                <button onClick={handleCopyScript} className="p-2 bg-slate-800 rounded"><Copy size={16}/></button>
                                <button onClick={handlePrintPDF} className="p-2 bg-red-800 rounded"><FileText size={16}/></button>
                                <button onClick={openAudioWithScript} className="p-2 bg-blue-600 rounded"><Volume2 size={16}/></button>
                              </div>
                           </div>
                           <textarea readOnly value={scriptState.finalJson.conteudo} className="w-full h-96 bg-slate-950 p-4 rounded text-slate-300 font-mono text-sm" />
                        </div>
                    )}
                </div>
                )}
            </div>

            {/* VIEW 2: NICHE ANALYZER */}
            <div className={activeView === 'niche-analyzer' ? 'block' : 'hidden'}>
                <NicheAnalyzer llmGateway={llmGateway} />
            </div>

            {/* VIEW 3: THEME CREATOR */}
            <div className={activeView === 'theme-creator' ? 'block' : 'hidden'}>
                <ThemeCreator llmGateway={llmGateway} />
            </div>

            {/* VIEW 4: TITLE & DESCRIPTION */}
            <div className={activeView === 'title-description' ? 'block' : 'hidden'}>
                <TitleDescriptionGenerator llmGateway={llmGateway} />
            </div>

            {/* VIEW 5: B-ROLL CREATOR */}
            <div className={activeView === 'broll-creator' ? 'block' : 'hidden'}>
                <BRollCreator llmGateway={llmGateway} />
            </div>

            {/* VIEW 6: THUMBNAIL CREATOR */}
            <div className={activeView === 'thumbnail-creator' ? 'block' : 'hidden'}>
                <ThumbnailCreator llmGateway={llmGateway} />
            </div>

            {/* VIEW 7: SETTINGS */}
            <div className={activeView === 'settings' ? 'block' : 'hidden'}>
                <Settings settings={llmSettings} onSave={handleSettingsSave} />
            </div>

          </main>
      </div>

      <AudioGeneratorModal 
        isOpen={isAudioModalOpen} 
        onClose={() => setIsAudioModalOpen(false)} 
        initialText={audioInitialText}
      />
    </div>
  );
};

export default App;
