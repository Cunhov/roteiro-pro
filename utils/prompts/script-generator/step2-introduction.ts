import { ScriptConfiguration } from '../../../types';

export const getStep2Prompt = (config: ScriptConfiguration, prevResult: string) => `
    # PROMPT 2 - ROTEIRO (INTRODUÇÃO)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    **DURAÇÃO ALVO:** ${config.videoLength}
    
    ## CONCEITO
    Você vai criar a ABERTURA/INTRODUÇÃO de um vídeo do YouTube.
    
    ## ESTRUTURA RECEBIDA (da etapa anterior):
    ${prevResult.substring(0, 5000)}
    
    ## TAREFA
    Com base na estrutura acima, escreva a INTRODUÇÃO completa do vídeo (0:00 até ~2:00 minutos).
    
    **A introdução deve incluir:**
    - Gancho inicial (hook) nos primeiros 3-5 segundos
    - Apresentação rápida do tema/problema
    - Promessa de valor (o que o espectador vai ganhar)
    - Breve contextualização se necessário
    - Transição para o desenvolvimento
    
    **FORMATO DE SAÍDA:**
    Retorne APENAS o texto de narração da introdução, pronto para ser lido.
    NÃO inclua tags de cena, descrições visuais ou comentários.
    NÃO use marcadores como [INTRO], [GANCHO], etc.
    
    ## RETORNE APENAS O TEXTO DA NARRAÇÃO DA INTRODUÇÃO:
`;
