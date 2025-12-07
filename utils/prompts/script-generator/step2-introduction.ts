import { ScriptConfiguration } from '../../../types';

export const getStep2Prompt = (config: ScriptConfiguration, strategyAnalysis: string) => `
    # PROMPT 2 - ROTEIRO (INTRODUÇÃO)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    **DURAÇÃO ALVO:** ${config.videoLength}
    
    ## ⚠️ REGRA CRÍTICA DE VOZ
    ${config.transcription && config.transcription.length > 100 ? `
    **VOCÊ TEM UMA TRANSCRIÇÃO ORIGINAL.**
    
    NÃO reescreva em estilo formal/corporativo.
    NÃO crie "pilares", "frameworks" ou estruturas genéricas.
    NÃO transforme storytelling pessoal em discurso professoral.
    
    **SUA MISSÃO:**
    - PRESERVE o tom autêntico identificado na análise
    - MANTÉN histórias pessoais e exemplos do original
    - USE as gírias e expressões características
    - Apenas ORGANIZE e OTIMIZE, não transforme
    ` : `
    **VOCÊ ESTÁ CRIANDO DO ZERO.**
    Siga o tom especificado em "${config.scriptStyle}".
    `}
    
    ## ANÁLISE ESTRATÉGICA (da etapa anterior):
    ${strategyAnalysis.substring(0, 5000)}
    
    ## TAREFA
    ${config.transcription && config.transcription.length > 100 ? `
    Com base na análise, pegue os primeiros **2-3 minutos** da transcrição original e:
    1. **Identifique** o gancho/hook que já existe
    2. **Organize** para máximo impacto nos primeiros 10 segundos
    3. **Mantenha** a voz autêntica do criador
    4. **Corte** apenas gorduras óbvias (repetição desnecessária, "ãh", "né", etc.)
    5. **Adicione** transições suaves se necessário
    
    **NÃO inventar novo conteúdo.** Trabalhe com o que já existe.
    ` : `
    Com base na estrutura, escreva a INTRODUÇÃO completa do vídeo (0:00 até ~2:00 minutos).
    
    **A introdução deve incluir:**
    - Gancho inicial (hook) nos primeiros 3-5 segundos
    - Apresentação rápida do tema/problema
    - Promessa de valor (o que o espectador vai ganhar)
    - Breve contextualização se necessário
    - Transição para o desenvolvimento
    `}
    
    ## FORMATO DE SAÍDA
    Retorne APENAS o texto de narração da introdução, pronto para ser lido.
    NÃO inclua tags de cena, descrições visuais ou comentários.
    NÃO use marcadores como [INTRO], [GANCHO], etc.
    
    ## RETORNE APENAS O TEXTO DA NARRAÇÃO DA INTRODUÇÃO:
`;
