
import React, { useState, useEffect } from 'react';
import { Save, Key, Cpu, Search, Image as ImageIcon, MessageSquare, Sliders, Thermometer, Brain, Zap } from 'lucide-react';
import { LLMSettings, LLMProvider, MODELS_BY_PROVIDER } from '../types';

interface SettingsProps {
    settings: LLMSettings;
    onSave: (settings: LLMSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
    const [localSettings, setLocalSettings] = useState<LLMSettings>(settings);
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
    const [customTextModel, setCustomTextModel] = useState('');
    const [customImageModel, setCustomImageModel] = useState('');

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    // AUTO-FIX: Ensure selected model belongs to selected provider
    useEffect(() => {
        // 1. Text Model Validation
        const availableTextModels = MODELS_BY_PROVIDER[localSettings.textProvider]?.text || [];
        const isTextModelValid = availableTextModels.includes(localSettings.modelText);

        // 2. Image Model Validation
        const availableImageModels = MODELS_BY_PROVIDER[localSettings.imageProvider]?.image || [];
        const isImageModelValid = availableImageModels.includes(localSettings.modelImage);

        if (!isTextModelValid || !isImageModelValid) {
            setLocalSettings(prev => ({
                ...prev,
                modelText: isTextModelValid ? prev.modelText : (availableTextModels[0] || ''),
                modelImage: isImageModelValid ? prev.modelImage : (availableImageModels[0] || '')
            }));
        }
    }, [localSettings.textProvider, localSettings.imageProvider]);

    const toggleShowKey = (provider: string) => {
        setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
    };

    const handleSave = () => {
        onSave(localSettings);
    };

    const updateKey = (provider: LLMProvider, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            keys: { ...prev.keys, [provider]: value }
        }));
    };

    const isThinkingModel = localSettings.modelText.includes('gemini-2.5') ||
        localSettings.modelText.includes('reasoner') ||
        localSettings.modelText.includes('o3') ||
        localSettings.modelText.includes('thinking');

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">

            {/* HEADER */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Cpu className="text-blue-500" />
                        Configuração Avançada de IA
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Gerencie o ecossistema de modelos e parâmetros finos (Salvo automaticamente no navegador).
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transform hover:-translate-y-0.5 transition-all"
                >
                    <Save size={18} />
                    <span>Salvar Tudo</span>
                </button>
            </div>

            {/* 1. API KEYS */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Key size={18} className="text-yellow-500" /> Chaves de API (Armazenadas Localmente)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Object.keys(MODELS_BY_PROVIDER) as LLMProvider[]).map(provider => (
                        <div key={provider} className="relative group">
                            <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">{provider}</label>
                            <input
                                type={showKeys[provider] ? "text" : "password"}
                                value={localSettings.keys[provider]}
                                onChange={(e) => updateKey(provider, e.target.value)}
                                placeholder={`Chave ${provider.toUpperCase()}`}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                            />
                            <button
                                onClick={() => toggleShowKey(provider)}
                                className="absolute right-3 top-8 text-slate-600 hover:text-white text-xs"
                            >
                                {showKeys[provider] ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. TASK ROUTING & MODELS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* TEXT AI */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-blue-400 font-bold border-b border-slate-800 pb-2">
                        <MessageSquare size={18} />
                        <h3>Roteiro & Texto</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 font-bold block mb-1">Provedor</label>
                            <select
                                value={localSettings.textProvider}
                                onChange={(e) => setLocalSettings({ ...localSettings, textProvider: e.target.value as LLMProvider })}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                            >
                                {Object.keys(localSettings.keys).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 font-bold block mb-1">Modelo</label>
                            <select
                                value={localSettings.modelText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '__custom__') {
                                        setCustomTextModel('');
                                    } else {
                                        setLocalSettings({ ...localSettings, modelText: value });
                                    }
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                            >
                                {MODELS_BY_PROVIDER[localSettings.textProvider]?.text.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                                <option value="__custom__">✏️ Custom/Other</option>
                            </select>
                            {localSettings.modelText === '__custom__' && (
                                <input
                                    type="text"
                                    placeholder="Digite o nome do modelo..."
                                    value={customTextModel}
                                    onChange={(e) => {
                                        setCustomTextModel(e.target.value);
                                        setLocalSettings({ ...localSettings, modelText: e.target.value });
                                    }}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs mt-2 placeholder:text-slate-600"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* IMAGE AI */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-pink-400 font-bold border-b border-slate-800 pb-2">
                        <ImageIcon size={18} />
                        <h3>Capa & B-Roll</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-xs text-slate-500 font-bold block mb-1">Provedor</label>
                            <select
                                value={localSettings.imageProvider}
                                onChange={(e) => setLocalSettings({ ...localSettings, imageProvider: e.target.value as LLMProvider })}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                            >
                                {Object.keys(localSettings.keys).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 font-bold block mb-1">Modelo</label>
                            <select
                                value={localSettings.modelImage}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '__custom__') {
                                        setCustomImageModel('');
                                    } else {
                                        setLocalSettings({ ...localSettings, modelImage: value });
                                    }
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                            >
                                {MODELS_BY_PROVIDER[localSettings.imageProvider]?.image.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                                <option value="__custom__">✏️ Custom/Other</option>
                            </select>
                            {localSettings.modelImage === '__custom__' && (
                                <input
                                    type="text"
                                    placeholder="Digite o nome do modelo..."
                                    value={customImageModel}
                                    onChange={(e) => {
                                        setCustomImageModel(e.target.value);
                                        setLocalSettings({ ...localSettings, modelImage: e.target.value });
                                    }}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs mt-2 placeholder:text-slate-600"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* SEARCH AI */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-green-400 font-bold border-b border-slate-800 pb-2">
                        <Search size={18} />
                        <h3>Grounding / Search</h3>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 font-bold block mb-1">Provedor</label>
                        <select
                            value={localSettings.searchProvider}
                            onChange={(e) => setLocalSettings({ ...localSettings, searchProvider: e.target.value as LLMProvider })}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                        >
                            {Object.keys(localSettings.keys).map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                        </select>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Recomendado: Gemini (Google Search) ou Grok (X Real-time).
                    </p>
                </div>
            </div>

            {/* 3. DETAILED PARAMETERS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* TEXT GENERATION PARAMS */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sliders size={18} className="text-purple-500" /> Parâmetros de Geração (Texto)
                    </h3>

                    <div className="space-y-6">

                        {/* Temperature */}
                        <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-1">
                                <span className="flex items-center gap-1"><Thermometer size={14} /> Criatividade (Temperatura)</span>
                                <span className="font-mono text-blue-400">{localSettings.temperature}</span>
                            </div>
                            <input
                                type="range" min="0" max="2" step="0.1"
                                value={localSettings.temperature}
                                onChange={(e) => setLocalSettings({ ...localSettings, temperature: parseFloat(e.target.value) })}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>Preciso (0.0)</span>
                                <span>Balanceado (0.7)</span>
                                <span>Criativo (2.0)</span>
                            </div>
                        </div>

                        {/* Max Tokens */}
                        <div>
                            <div className="flex justify-between text-sm text-slate-300 mb-1">
                                <span className="flex items-center gap-1"><Zap size={14} /> Tamanho Máximo (Tokens)</span>
                                <span className="font-mono text-blue-400">{localSettings.maxOutputTokens}</span>
                            </div>
                            <input
                                type="number" step="1024"
                                value={localSettings.maxOutputTokens}
                                onChange={(e) => setLocalSettings({ ...localSettings, maxOutputTokens: parseInt(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">
                                Scripts longos requerem pelo menos 4096-8192 tokens.
                            </p>
                        </div>

                        {/* Thinking / Reasoning */}
                        <div className={`p-4 rounded-lg border ${isThinkingModel ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-950 border-slate-800 opacity-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-indigo-300 cursor-pointer">
                                    <Brain size={16} />
                                    Thinking / Reasoning
                                    <input
                                        type="checkbox"
                                        checked={localSettings.enableThinking}
                                        onChange={(e) => setLocalSettings({ ...localSettings, enableThinking: e.target.checked })}
                                        disabled={!isThinkingModel}
                                        className="ml-2 w-4 h-4 rounded text-indigo-500"
                                    />
                                </label>
                                {isThinkingModel && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full">Suportado</span>}
                            </div>

                            {localSettings.enableThinking && (
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-indigo-200 mb-1">
                                        <span>Orçamento de Pensamento (Tokens)</span>
                                        <span>{localSettings.thinkingBudget}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="8192" step="1024"
                                        value={localSettings.thinkingBudget}
                                        onChange={(e) => setLocalSettings({ ...localSettings, thinkingBudget: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            )}
                            <p className="text-[10px] text-slate-500 mt-2">
                                Habilita Cadeia de Pensamento (CoT). Apenas para modelos compatíveis (Gemini 2.5, DeepSeek R1, o1/o3).
                            </p>
                        </div>
                    </div>
                </div>

                {/* GLOBAL TOOLS & IMAGE PARAMS */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Search size={18} className="text-green-500" /> Ferramentas
                        </h3>
                        <label className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 cursor-pointer hover:border-slate-600 transition-colors">
                            <div>
                                <span className="text-sm font-medium block">Google Search Grounding</span>
                                <span className="text-xs text-slate-500">Permite que o modelo acesse dados em tempo real da web.</span>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.enableSearch}
                                onChange={(e) => setLocalSettings({ ...localSettings, enableSearch: e.target.checked })}
                                className="w-5 h-5 rounded text-green-600"
                            />
                        </label>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ImageIcon size={18} className="text-pink-500" /> Parâmetros de Imagem
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Aspect Ratio</label>
                                <select
                                    value={localSettings.imageAspectRatio}
                                    onChange={(e) => setLocalSettings({ ...localSettings, imageAspectRatio: e.target.value as any })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                                >
                                    <option value="16:9">16:9 (Youtube)</option>
                                    <option value="9:16">9:16 (Shorts/Reels)</option>
                                    <option value="1:1">1:1 (Post)</option>
                                    <option value="4:3">4:3 (TV)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500">Resolução</label>
                                <select
                                    value={localSettings.imageResolution}
                                    onChange={(e) => setLocalSettings({ ...localSettings, imageResolution: e.target.value as any })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm"
                                >
                                    <option value="1024x1024">1024x1024 (Padrão)</option>
                                    <option value="other">Máxima (HD)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
