import { ScriptConfiguration } from '../../../types';

export const getStep1Prompt = (config: ScriptConfiguration) => {
    const isAuthority = config.channelType === 'authority';
    const hasTranscription = config.transcription && config.transcription.length > 100;

    const contextBase = `
    **CONTEXTO GERAL:**
    - **Idioma Alvo:** ${config.targetLanguage} (Adapte TODAS as gírias, referências culturais e moeda para este local).
    - **Nome do Canal:** ${config.channelName || 'Não Informado'}
    - **Estilo/Tom:** ${config.scriptStyle}
    - **Duração Alvo:** ${config.videoLength}
    - **Temas/Inputs:** ${config.topic}
  `;

    if (hasTranscription) {
        // MODO TRANSCRIÇÃO: Preservar voz original
        return `
    # PROMPT 1 - ANÁLISE ESTRATÉGICA DE TRANSCRIÇÃO EXISTENTE
    ${contextBase}
    
    ## ⚠️ REGRA CRÍTICA: PRESERVAÇÃO DE VOZ
    Você recebeu uma TRANSCRIÇÃO REAL de um vídeo. Sua missão NÃO é reescrever do zero.
    Sua missão é ANALISAR e MAPEAR a estrutura que JÁ EXISTE, preservando:
    - Tom de voz AUTÊNTICO (se é direto e cru, mantenha direto e cru)
    - Storytelling PESSOAL (exemplos de vida real, vulnerabilidade)
    - Gírias e expressões ORIGINAIS do criador
    - Ritmo e cadência NATURAL da fala
    
    ## SUA TAREFA
    1. **IDENTIFIQUE** o que já está funcionando:
       - Qual o gancho/problema inicial?
       - Quais histórias pessoais são contadas?
       - Qual a promessa/solução oferecida?
       - Como ele estrutura argumentos?
       - Qual o tom emocional (raiva, humor, seriedade)?
    
    2. **MAPEIE** a estrutura atual:
       - Início: Minutos 0-2 (o que tem?)
       - Meio: Desenvolvimento (como flui?)
       - Fim: Conclusão/CTA (como fecha?)
    
    3. **SUGIRA** apenas MELHORIAS SUTIS:
       - Reordenar trechos se houver repetição
       - Identificar onde cortar gordura
       - Marcar onde adicionar transições
       - NÃO transforme em "5 pilares" genérico
       - NÃO formalize se o original é coloquial
       - NÃO crie nova narrativa, trabalhe com a existente
    
    ## FORMATO DE SAÍDA
    Retorne um MAPEAMENTO ESTRATÉGICO em texto simples:
    - Tom identificado: [descreva]
    - Gancho atual: [cite da transcrição]
    - Estrutura narrativa: [descreva o fluxo]
    - Pontos fortes: [liste 3-5]
    - Sugestões de ajuste: [apenas melhorias, não transformação]
    
    ## TRANSCRIÇÃO ORIGINAL:
    ${config.transcription!.substring(0, 30000)}
    
    ## RETORNE APENAS A ANÁLISE ESTRATÉGICA, SEM REESCREVER O ROTEIRO:
    `;
    }

    // MODO CRIAÇÃO DO ZERO (quando NÃO há transcrição)
    if (isAuthority) {
        return `
    # PROMPT 1 - ESTRUTURA DE AUTORIDADE (CRIAÇÃO DO ZERO)
    ${contextBase}
    - **Apresentador:** ${config.narratorName || 'Especialista'} (Expert/Mentor)
    
    ## SUA MISSÃO
    Você é um estrategista de Personal Branding. Estruture um roteiro onde o apresentador fala DIRETAMENTE com a câmera (Face-to-Camera).
    
    ## TAREFA
    Analise os inputs e crie um esqueleto do vídeo contendo:
    - O Grande Problema que o público enfrenta
    - A Promessa Única (transformação oferecida)
    - Estrutura Didática (como entregar a promessa)
    - Pontos de Conexão (storytelling pessoal se aplicável)
    - Momentos de Retenção (ganchos para manter atenção)
    
    Retorne apenas o esquema estrutural em texto.
    `;
    } else {
        return `
    # PROMPT 1 - ESTRUTURA DOCUMENTAL (DARK CHANNEL) (CRIAÇÃO DO ZERO)
    ${contextBase}
    
    ## SUA MISSÃO
    Você é um Showrunner de canais "Faceless" (Sem Rosto). Estruture um roteiro focado em NARRATIVA, MISTÉRIO e VISUAIS.
    
    ## TAREFA
    Analise os inputs e crie um esqueleto do vídeo estilo "Video Essay" ou "Mini-Doc":
    - O Mistério Inicial (hook que gera curiosidade)
    - A Tese (ponto de vista único)
    - Arcos Narrativos (como desenrolar a história)
    - Sugestões Visuais Macro (b-roll conceitual)
    
    Retorne apenas o esquema estrutural em texto.
    `;
    }
};
