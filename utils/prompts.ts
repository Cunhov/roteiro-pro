
import { ScriptConfiguration } from "../types";

// ... [Existing Prompts Retained - abbreviated for XML brevity, imagine previous content here] ...
// Re-exporting existing prompts for context + NEW PROMPTS below.

// =========================================================================
// EXISTING PROMPTS (Keeping them intact)
// =========================================================================

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

export const getStep2Prompt = (config: ScriptConfiguration, prevResult: string) => `
    # PROMPT 2 - ROTEIRO (INTRODUÇÃO)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    ## TAREFA
    Escreva o início do roteiro (0:00 até ~2:00 minutos).
    **INPUT ESTRUTURAL:** ${prevResult}
    Escreve APENAS o texto da narração.
`;

export const getStep3Prompt = (config: ScriptConfiguration, prevResult: string) => `
    # PROMPT 3 - ROTEIRO (DESENVOLVIMENTO)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    ## TAREFA
    Escreve o CORPO principal do vídeo.
    (Contexto da estrutura: ${prevResult.substring(0, 500)}...)
    Escreve APENAS o texto da narração.
`;

export const getStep4Prompt = (config: ScriptConfiguration, intro: string, body: string) => `
    # PROMPT 4 - INTEGRAÇÃO DE PRODUTO (MID-ROLL)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    ## TAREFA
    Insira CTA do Produto: "${config.productCTA}"
    INTRO: ${intro}
    CORPO: ${body}
`;

export const getStep5Prompt = (config: ScriptConfiguration, partialScript: string) => `
    # PROMPT 5 - PATROCÍNIO E ENCERRAMENTO
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    ## TAREFA
    Adicione CTA Patrocínio: "${config.sponsorCTA}" e Conclusão.
    INPUT: ${partialScript}
`;

export const getStep6Prompt = (config: ScriptConfiguration, script: string) => `
    # PROMPT 6 - AUDITORIA DE CONTEÚDO
    Verifique idioma, tom, CTAs e naturalidade.
    ROTEIRO: ${script}
`;

export const getStep7Prompt = (config: ScriptConfiguration, fullScript: string) => `
    Assistente de SSML ElevenLabs. Normalize e adicione tags.
    INPUT: ${fullScript}
`;

export const getPromptFix = (roteiroComErros: string, listaErros: string[]) => `
    # PROMPT DE CORREÇÃO
    Corrija: ${listaErros.join('\n')}
    Roteiro: ${roteiroComErros}
`;

export const getNicheExtractionPrompt = (textoEntrada: string) => `
    # AGENTE 1: EXTRATOR HIERÁRQUICO
    Entrada: ${textoEntrada.substring(0, 30000)}
`;
export const getMarketAnalysisPrompt = (listaExtraida: string) => `
    # AGENTE 2: DATA SCIENTIST SIMULADO
    Dados: ${listaExtraida}
`;
export const getNicheReportPrompt = (dadosMercado: string) => `
    # AGENTE 3: RELATÓRIO DE MERCADO
    Dados: ${dadosMercado}
`;
export const getDarkStrategyPrompt = (dadosMercado: string) => `
    # AGENTE 4-A: ESTRATEGISTA DARK
    Dados: ${dadosMercado}
`;
export const getAuthorityStrategyPrompt = (dadosMercado: string) => `
    # AGENTE 4-B: ESTRATEGISTA AUTORIDADE
    Dados: ${dadosMercado}
`;
export const getThemeCreatorPrompt = (inputText: string) => `
    # AGENTE CRIATIVO
    Input: ${inputText.substring(0, 30000)}
`;
export const getBRollSegmentationPrompt = (text: string, pacing: string, sourcePref: string, mood?: string, style?: string) => `
    # AGENTE B-ROLL
    Ritmo: ${pacing}. Fonte: ${sourcePref}. Mood: ${mood}.
    Entrada: ${text.substring(0, 50000)}
`;


// =========================================================================
// NEW: TITLE & DESCRIPTION AGENTS
// =========================================================================

export const getDescriptionAgentPrompt = (transcription: string) => `
# MISSÃO: Agente Especialista em Conteúdo e SEO para YouTube

## 1. PERSONA
Você é um Agente de IA Especialista em SEO para YouTube e Estratégia de Conteúdo.

## 2. CONTEXTO
Você receberá a transcrição completa de um vídeo do YouTube.

## 3. TAREFA E ESTRUTURA DE SAÍDA
Analise a transcrição e gere o conteúdo dividido exatamente nas seguintes 4 seções:

### **SEÇÃO 1: RESUMO INICIAL CATIVANTE**
Crie um parágrafo curto e envolvente (3 a 5 linhas).
*   **Obrigatório:** Comece com as 1-2 palavras-chave mais importantes.
*   **Estilo:** Use uma pergunta intrigante ou apresente o principal problema/benefício.

### **SEÇÃO 2: CAPÍTULOS DO VÍDEO (TIMESTAMPS)**
Crie uma lista de capítulos com timestamps.
*   **Formato:** MM:SS Nome do Capítulo Descritivo e com Palavra-Chave
*   O primeiro timestamp deve ser sempre 00:00.

### **SEÇÃO 3: VALIDAÇÃO CIENTÍFICA (CONDICIONAL)**
**ATENÇÃO:** Execute esta seção **SE, E SOMENTE SE**, o vídeo tratar de temas como saúde, nutrição, ciência, etc. Se for entretenimento, ignore.
*   **Processo:** Identifique 2-4 alegações e cite evidências (Estudos/Autores).
*   **Formato:**
    📌 **Ponto Abordado:** [Alegação]
    🔬 **Evidência Científica:** [Estudo/Autor/Ano/Link]

### **SEÇÃO 4: SEO EXTREMAMENTE DETALHADO**
1. **Palavras-chave Principais:** 5-7 palavras-chave centrais.
2. **Palavras-chave de Cauda Longa (Long-Tail):** 7-10 frases específicas.
3. **Maiores Pesquisas no Google/YouTube (Perguntas):** 10-15 perguntas diretas.
4. **Tags para YouTube:** 20-25 tags separadas por vírgula.
5. **Hashtags:** 3-5 hashtags concisas.

## INPUT TRANSCRIPTION:
${transcription.substring(0, 60000)}
`;

export const getTitleAgentPrompt = (transcription: string) => `
# MISSÃO: Mestre em Copywriting e Estratégia de Títulos para YouTube

## 1. PERSONA
Você é um "Mestre dos Títulos", especialista em copywriting para YouTube, focado em CTR.

## 2. CONTEXTO
Analise o conteúdo do vídeo para gerar títulos irresistíveis.

## 3. TAREFA E ESTRUTURA DE SAÍDA
Gere de **8 a 10 opções de títulos** organizados nestas categorias.
*   Comprimento Ideal: < 60 caracteres.
*   Uso de CAPS em 1-2 palavras.
*   Use palavras de poder.

### **CATEGORIAS DE TÍTULOS**

**1. Título Direto e Otimizado para SEO**
*   Ex: "JEJUM INTERMITENTE: Guia Completo Para Iniciantes em 2024"

**2. Título de Curiosidade / Lacuna de Informação**
*   Ex: "O Que NINGUÉM Te Contou Sobre Tomar Café em Jejum"

**3. Título Focado em Benefício / Transformação**
*   Ex: "Perca Gordura Abdominal RÁPIDO com Este Protocolo"

**4. Título Numérico / Lista (Listicle)**
*   Ex: "Os 5 PIORES Erros que Impedem Você de Ganhar Músculos"

**5. Título de Confronto / Polêmica (Ousado)**
*   Ex: "Por que a Dieta Cetogênica é uma FARSA"

**6. Título em Formato de Pergunta**
*   Ex: "Você Realmente Precisa de 8 Horas de Sono por Noite?"

## INPUT TRANSCRIPTION:
${transcription.substring(0, 60000)}
`;

export const getThumbnailPlannerPrompt = (context: string) => `
# AGENTE ESPECIALISTA EM THUMBNAILS (YOUTUBE)

## CONTEXTO
Você é um designer e estrategista de thumbnails virais para o YouTube. Seu objetivo é maximizar o CTR (Click Through Rate).
Você receberá o roteiro, resumo ou ideia de um vídeo.

## TAREFA
1. Analise o conteúdo para identificar o "Gancho Visual" mais forte.
2. Crie um **Prompt de Geração de Imagem** altamente detalhado, otimizado para modelos como DALL-E 3, Midjourney ou Flux.
3. O prompt deve descrever:
   - Sujeito principal (expressão facial exagerada, iluminação dramática).
   - Fundo (contraste, cores vibrantes, profundidade de campo).
   - Elementos de destaque (setas, círculos, objetos brilhantes - se aplicável ao estilo).
   - Estilo artístico (ex: "Hyper-realistic 4k photography", "3D render style", "Dramatic lighting").

## SAÍDA (Apenas o Prompt em Inglês)
Retorne APENAS o prompt de imagem final, em inglês, pronto para ser usado no gerador. Não inclua explicações.

## CONTEÚDO DO VÍDEO:
${context.substring(0, 5000)}
`;
