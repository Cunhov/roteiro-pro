
export type ChannelType = 'authority' | 'dark';

// --- LLM Settings Types ---
export type LLMProvider = 'gemini' | 'poe' | 'openai' | 'anthropic' | 'deepseek' | 'grok';

export interface ProviderConfig {
  apiKey: string;
}

export interface LLMSettings {
  // Provider Keys Repository
  keys: Record<LLMProvider, string>;

  // Task Routing
  textProvider: LLMProvider;
  imageProvider: LLMProvider;
  searchProvider: LLMProvider;

  // Model Selection
  modelText: string;
  modelImage: string;

  // Advanced Parameters
  enableSearch: boolean; // Grounding
  enableThinking: boolean; // Reasoning/Thinking models

  // Specific Generation Parameters
  temperature: number; // 0.0 to 2.0 (Creativity)
  maxOutputTokens: number; // Token limit
  thinkingBudget: number; // For reasoning models (token budget)

  // Image Parameters
  imageAspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '3:4';
  imageResolution: '1024x1024' | 'other';
}

export const DEFAULT_LLM_SETTINGS: LLMSettings = {
  keys: {
    gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
    poe: '',
    openai: '',
    anthropic: '',
    deepseek: '',
    grok: ''
  },
  textProvider: 'gemini',
  imageProvider: 'gemini',
  searchProvider: 'gemini',
  modelText: 'gemini-2.5-flash',
  modelImage: 'gemini-3-pro-image-preview',

  // Advanced Defaults
  enableSearch: false,
  enableThinking: false,
  temperature: 0.7,
  maxOutputTokens: 8192,
  thinkingBudget: 1024,

  imageAspectRatio: '16:9',
  imageResolution: '1024x1024'
};

// Organized by Provider based on Dec 2025 Reports
// Prices format: ($Input per 1M / $Output per 1M)
export const MODELS_BY_PROVIDER: Record<LLMProvider, { text: string[], image: string[] }> = {
  gemini: {
    text: [
      'gemini-3-pro-preview',
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.5-flash-preview-09-2025',
      'gemini-2.5-flash-lite-preview-09-2025',
      'gemini-2.0-flash',
      'gemini-2.5-computer-use-preview',
      'gemma-3',
    ],
    image: [
      'gemini-3-pro-image-preview',
      'gemini-2.5-flash-image',
      'imagen-4.0-generate-001',
      'imagen-4.0-fast-generate-001',
      'veo-3.1-generate-preview',
      'veo-3.1-fast-generate-preview'
    ]
  },
  poe: {
    text: [
      'GPT-5',
      'Claude-3.5-Sonnet',
      'Claude-3-Opus',
      'Claude-Opus-4.1',
      'Gemini-2.5-Pro',
      'Gemini-1.5-Pro',
      'Llama-3.1-405B',
      'Llama-3.1-70B',
      'Grok-4',
      'o3-mini',
      'DeepSeek-R1',
      'Qwen-2.5-Coder-32B'
    ],
    image: [
      'Flux-Pro-1.1',
      'Flux-Dev',
      'Ideogram-v2',
      'DALL-E-3',
      'Playground-v3',
      'StableDiffusion-3.5-Large',
      'Midjourney-v6',
      'GPT-Image-1'
    ]
  },
  openai: {
    text: [
      'gpt-5.1',
      'gpt-5.1-codex',
      'gpt-5-pro',
      'gpt-5',
      'gpt-5-mini',
      'gpt-5-nano',
      'o3-pro',
      'o3',
      'o3-deep-research',
      'o4-mini',
      'gpt-4.1',
      'gpt-4o',
      'computer-use-preview'
    ],
    image: [
      'gpt-image-1',
      'gpt-image-1-mini',
      'sora-2',
      'dall-e-3'
    ]
  },
  grok: {
    text: [
      'grok-4.1-fast',
      'grok-4-1-fast-reasoning',
      'grok-code-fast-1',
      'grok-4-fast-reasoning',
      'grok-3',
      'grok-3-mini',
      'grok-2-vision-1212'
    ],
    image: [
      'grok-2-image-1212'
    ]
  },
  anthropic: {
    text: [
      'claude-4.5-opus',
      'claude-4.1-opus',
      'claude-4.5-sonnet',
      'claude-4.5-haiku',
      'claude-3.5-haiku'
    ],
    image: []
  },
  deepseek: {
    text: [
      'deepseek-chat',
      'deepseek-reasoner',
      'deepseek-v3.2-speciale'
    ],
    image: [
      'janus-pro'
    ]
  }
};

// Flattened list for legacy support if needed
export const AVAILABLE_MODELS = {
  text: Object.values(MODELS_BY_PROVIDER).flatMap(p => p.text),
  image: Object.values(MODELS_BY_PROVIDER).flatMap(p => p.image)
};

// --- Script Generator Types ---
export interface ScriptConfiguration {
  channelType: ChannelType;
  topic: string;
  transcription: string;
  videoCover: string | null; // Base64

  // Specific Inputs
  channelName: string;
  narratorName: string; // Optional for Dark
  productCTA: string; // Info-product summary
  sponsorCTA: string; // Sponsor/Coupon summary
  scriptStyle: string; // e.g., "Informal", "Professional", "Investigative"
  videoLength: string; // e.g., "8-12 minutes"
  targetLanguage: string; // e.g., "Português (Brasil)", "English (US)"
}

export interface ScriptState {
  config: ScriptConfiguration;
  currentStep: number;
  results: string[];
  isProcessing: boolean;
  isComplete: boolean;
  error: string | null;
  finalJson: RoteiroFinalJSON | null;
}

export enum StepStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  WAITING = 'waiting'
}

export interface StepDefinition {
  id: number;
  title: string;
  description: string;
}

// Passos do Gerador de Roteiro
export const PROCESSING_STEPS: StepDefinition[] = [
  { id: 1, title: 'Estratégia & Estrutura', description: 'Definindo ângulo, duração e ganchos culturais...' },
  { id: 2, title: 'Roteiro: Introdução', description: 'Criando Gancho Viral e Problema...' },
  { id: 3, title: 'Roteiro: Desenvolvimento', description: 'Conteúdo principal (Autoridade ou Narrativa)...' },
  { id: 4, title: 'Integração de Produto', description: 'Inserindo CTA do Infoproduto naturalmente...' },
  { id: 5, title: 'Integração de Patrocínio', description: 'Inserindo Patrocinador e Encerramento...' },
  { id: 6, title: 'Auditoria de Conteúdo', description: 'Verificando tom, idioma e validando CTAs...' },
  { id: 7, title: 'Normalização SSML', description: 'Otimizando para ElevenLabs com pausas e formatação...' },
];

// Passos do Analisador de Nichos
export const NICHE_STEPS: StepDefinition[] = [
  { id: 1, title: 'Extrator Hierárquico', description: 'Mapeando 10 Nichos > 3 Subnichos > 3 Temas...' },
  { id: 2, title: 'Scanner de Mercado', description: 'Simulando dados de canais e demanda global...' },
  { id: 3, title: 'Classificador Blue Ocean', description: 'Gerando Matriz de Oportunidade...' },
  { id: 4, title: 'Plano Estratégico', description: 'Gerando plano de execução (Dark/Faceless ou Autoridade)...' },
];

export interface RoteiroFinalJSON {
  metadata: {
    canal: string;
    apresentador: string;
    tema: string;
    idioma: string;
    data_criacao: string;
    versao: string;
    status: "pronto_para_gravar" | "requer_ajustes";
  };
  conteudo: string;
  validacoes: {
    limpeza: boolean;
    normalizacao: boolean;
    fluidez: boolean;
    cta_posicionado: boolean;
    sem_erros: boolean;
  };
  instrucoes_elevenlabs: {
    idioma: string;
    velocidade_recomendada: string;
    tom_recomendado: string;
    instruces: string[];
  };
}

// --- B-Roll Creator Types ---
export type BRollPacing = 'fast' | 'medium' | 'slow' | 'auto';
export type BRollSource = 'search' | 'generate' | 'mixed';

export interface BRollSegment {
  id: number;
  timestampStart: string;
  timestampEnd: string;
  textContext: string;
  visualDescription: string;
  sourceType: 'search' | 'generate'; // The decided source for this specific segment
  imageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface BRollConfig {
  pacing: BRollPacing;
  source: BRollSource;
  refImages: string[]; // base64
  style?: string;
  mood?: string;
}

export type AppView = 'script-generator' | 'niche-analyzer' | 'theme-creator' | 'broll-creator' | 'title-description' | 'thumbnail-creator' | 'settings';
export type StrategyType = 'dark' | 'authority' | null;
