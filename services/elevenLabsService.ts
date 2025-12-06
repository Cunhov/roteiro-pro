
export interface ElevenLabsSettings {
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
  text: string;
}

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

export const generateElevenLabsAudio = async (settings: ElevenLabsSettings): Promise<Blob> => {
  if (!API_KEY) {
    throw new Error("Chave da API ElevenLabs não encontrada. Configure VITE_ELEVENLABS_API_KEY no arquivo .env.local");
  }

  // Mapeamento dos settings para o corpo da requisição
  const body = {
    text: settings.text,
    model_id: settings.modelId,
    voice_settings: {
      stability: settings.stability,
      similarity_boost: settings.similarityBoost,
      style: settings.style,
      use_speaker_boost: settings.useSpeakerBoost
    }
  };

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail?.message || `Erro na API ElevenLabs: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error: any) {
    console.error("ElevenLabs API Error:", error);
    throw error;
  }
};

// Lista de modelos disponíveis
export const ELEVENLABS_MODELS = [
  { id: 'eleven_multilingual_v2', name: 'Eleven Multilingual v2' },
  { id: 'eleven_turbo_v2_5', name: 'Eleven Turbo v2.5' },
  { id: 'eleven_multilingual_v1', name: 'Eleven Multilingual v1' },
  { id: 'eleven_monolingual_v1', name: 'Eleven Monolingual v1' }
];

// Lista de vozes (pode ser expandida ou buscada da API no futuro)
export const DEFAULT_VOICES = [
  { id: import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb', name: 'Daniel Cunha (Principal)' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni' },
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
];
