import { ScriptConfiguration } from '../../../types';

/**
 * OPTIMIZED STEP 4: Merges old Steps 4 (Product CTA) and 5 (Sponsor/Outro)
 * This reduces the pipeline from 7 to 5 steps, saving API calls
 */
export const getStep4Prompt = (config: ScriptConfiguration, intro: string, body: string) => `
    # PROMPT 4 - FINALIZAÇÃO COMPLETA DO ROTEIRO (PRODUCT CTA + SPONSOR + CONCLUSÃO)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    
    ## SUA MISSÃO
    Você está finalizando um roteiro de vídeo. Você já tem a INTRODUÇÃO e o CORPO.
    Agora você precisa adicionar TUDO que falta para completar o vídeo:
    1. CTA do PRODUTO (mid-roll)
    2. CTA do PATROCINADOR
    3. CONCLUSÃO final
    
    ## TAREFA
    
    ### PARTE 1: Inserir CTA do Produto
    - Insira o CTA do produto APÓS o corpo, de forma NATURAL
    - Use transição suave: "Pausa rápida...", "Antes de continuar...", "E por falar nisso..."
    - Apresente o CTA de forma convincente mas não agressiva
    
    ### PARTE 2: Adicionar Patrocínio
    - Após o CTA do produto, adicione o CTA do PATROCINADOR
    - Use transição natural: "Este vídeo é patrocinado por...", "Falando em soluções..."
    - Integre de forma fluida ao contexto do vídeo
    
    ### PARTE 3: Criar Conclusão
    - Finalize o vídeo com uma conclusão impactante
    - Resuma os pontos principais brevemente
    - Call-to-action final (like, comment, subscribe, próximo vídeo)
    - Despedida característica do canal
    
    ## CTA DO PRODUTO:
    ${config.productCTA}
    
    ## CTA DO PATROCINADOR:
    ${config.sponsorCTA}
    
    ## INTRODUÇÃO (já escrita):
    ${intro.substring(0, 15000)}
    
    ## CORPO PRINCIPAL (já escrito):
    ${body.substring(0, 15000)}
    
    ## IMPORTANTE:
    **RETORNE O ROTEIRO COMPLETO E FINAL**
    Deve conter TUDO na ordem:
    1. Toda a introdução que você recebeu
    2. Todo o corpo que você recebeu
    3. CTA do produto (que você vai adicionar)
    4. CTA do patrocinador (que você vai adicionar)
    5. Conclusão (que você vai criar)
    
    ## RETORNE APENAS O ROTEIRO COMPLETO FINAL SEM COMENTÁRIOS:
`;
