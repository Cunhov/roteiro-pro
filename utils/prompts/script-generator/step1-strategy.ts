import { ScriptConfiguration } from '../../../types';

export const getStep1Prompt = (config: ScriptConfiguration) => {
    const isAuthority = config.channelType === 'authority';
    const contextBase = `
    **CONTEXTO GERAL:**
    - **Idioma Alvo:** ${config.targetLanguage} (Adapte TODAS as gírias, referências culturais e moeda para este local).
    - **Nome do Canal:** ${config.channelName || 'Não Informado'}
    - **Estilo/Tom:** ${config.scriptStyle}
    - **Duração Alvo:** ${config.videoLength}
    - **Temas/Inputs:** ${config.topic}
    ${config.transcription ? `\n**Transcrição Base Disponível:** Sim` : ''}
  `;

    if (isAuthority) {
        return `
    # PROMPT 1 - ESTRUTURA DE AUTORIDADE
    ${contextBase}
    - **Apresentador:** ${config.narratorName || 'Especialista'} (Expert/Mentor)
    ## SUA MISSÃO
    Você é um estrategista de Personal Branding. Estruture um roteiro onde o apresentador fala DIRETAMENTE com a câmera (Face-to-Camera).
    ## TAREFA
    Analise os inputs e crie um esqueleto do vídeo contendo: O Grande Problema, A Promessa Única, Estrutura Didática, Pontos de Conexão, Momentos de Retenção.
    Retorne apenas o esquema estrutural em texto.
    ${config.transcription ? `\n**USE ESTA TRANSCRIÇÃO COMO FONTE:**\n${config.transcription.substring(0, 5000)}...` : ''}
    `;
    } else {
        return `
    # PROMPT 1 - ESTRUTURA DOCUMENTAL (DARK CHANNEL)
    ${contextBase}
    ## SUA MISSÃO
    Você é um Showrunner de canais "Faceless" (Sem Rosto). Estruture um roteiro focado em NARRATIVA, MISTÉRIO e VISUAIS.
    ## TAREFA
    Analise os inputs e crie um esqueleto do vídeo estilo "Video Essay" ou "Mini-Doc": O Mistério Inicial, A Tese, Arcos Narrativos, Sugestões Visuais Macro.
    Retorne apenas o esquema estrutural em texto.
    ${config.transcription ? `\n**USE ESTA TRANSCRIÇÃO COMO FONTE:**\n${config.transcription.substring(0, 5000)}...` : ''}
    `;
    }
};
