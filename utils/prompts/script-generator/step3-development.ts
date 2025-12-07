import { ScriptConfiguration } from '../../../types';

export const getStep3Prompt = (config: ScriptConfiguration, strategyAnalysis: string) => `
    # PROMPT 3 - ROTEIRO(DESENVOLVIMENTO / CORPO)
    ** IDIOMA OBRIGATÓRIO:** ${ config.targetLanguage }
    ** TOM DE VOZ:** ${ config.scriptStyle }
    ** DURAÇÃO ALVO:** ${ config.videoLength }
    
    ## ⚠️ REGRA CRÍTICA DE VOZ
    ${
    config.transcription && config.transcription.length > 100 ? `
    **VOCÊ TEM UMA TRANSCRIÇÃO ORIGINAL.**
    
    NÃO transforme em "Pilar 1, Pilar 2, Pilar 3" genérico.
    NÃO formalize storytelling pessoal e cru.
    NÃO substitua exemplos reais por conceitos abstratos.
    
    **SUA MISSÃO:**
    - PRESERVE histórias pessoais (ex: "quando eu tinha 12 anos...", "esse garoto Lucas...")
    - MANTENHA o fluxo narrativo original
    - USE as mesmas analogias e metáforas do criador
    - Apenas ORGANIZE melhor e CORTE repetições
    ` : `
    **VOCÊ ESTÁ CRIANDO DO ZERO.**
    Desenvolva o conteúdo central seguindo o tom "${config.scriptStyle}".
    `}
    
    ## ESTRUTURA ESTRATÉGICA(da etapa 1):
    ${ strategyAnalysis.substring(0, 5000) }
    
    ## TAREFA
    ${
    config.transcription && config.transcription.length > 100 ? `
    Com base na análise, pegue o **corpo principal** da transcrição (após a intro) e:
    1. **Identifique** os arguments/pontos principais que o criador já faz
    2. **Reorganize** se necessário para melhor fluxo lógico
    3. **Preserve** TODAS as histórias pessoais e exemplos específicos
    4. **Mantenha** gírias, tom emocional (raiva, humor, urgência)
    5. **Corte** apenas repetições óbvias e divagações
    6. **Adicione** transições se os parágrafos estão soltos
    
    **NÃO crie novo conteúdo.** Trabalhe com o material existente.
    ` : `
    Com base na estrutura, escreva o DESENVOLVIMENTO/CORPO principal do vídeo.
    
    **O corpo deve incluir:**
    - Desenvolvimento dos pontos principais da estrutura
    - Exemplos, evidências ou narrativas de suporte
    - Manutenção do ritmo e engajamento
    - Elementos de retenção (miniclímax, revelações graduais)
    - Preparação para a conclusão
    `}
    
    ## FORMATO DE SAÍDA
    Retorne APENAS o texto de narração do corpo principal, pronto para ser lido.
    NÃO inclua tags de cena, descrições visuais ou comentários.
    NÃO use marcadores como[DESENVOLVIMENTO], [PONTO 1], etc.
    
    ## RETORNE APENAS O TEXTO DA NARRAÇÃO DO CORPO:
`;
