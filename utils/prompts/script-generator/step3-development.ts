import { ScriptConfiguration } from '../../../types';

export const getStep3Prompt = (config: ScriptConfiguration, prevResult: string) => `
    # PROMPT 3 - ROTEIRO (DESENVOLVIMENTO/CORPO)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    **DURAÇÃO ALVO:** ${config.videoLength}
    
    ## CONCEITO
    Você vai criar o CORPO PRINCIPAL de um vídeo do YouTube.
    
    ## ESTRUTURA ESTRATÉGICA (da etapa 1):
    ${prevResult.substring(0, 5000)}
    
    ## TAREFA
    Com base na estrutura acima, escreva o DESENVOLVIMENTO/CORPO principal do vídeo.
    Esta é a parte central onde você explica, ensina, argumenta ou conta a história principal.
    
    **O corpo deve incluir:**
    - Desenvolvimento dos pontos principais da estrutura
    - Exemplos, evidências ou narrativas de suporte
    - Manutenção do ritmo e engajamento
    - Elementos de retenção (miniclímax, revelações graduais)
    - Preparação para a conclusão
    
    **FORMATO DE SAÍDA:**
    Retorne APENAS o texto de narração do corpo principal, pronto para ser lido.
    NÃO inclua tags de cena, descrições visuais ou comentários.
    NÃO use marcadores como [DESENVOLVIMENTO], [PONTO 1], etc.
    
    ## RETORNE APENAS O TEXTO DA NARRAÇÃO DO CORPO:
`;
