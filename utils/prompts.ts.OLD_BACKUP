
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

export const getStep4Prompt = (config: ScriptConfiguration, intro: string, body: string) => `
    # PROMPT 4 - INTEGRAÇÃO DE PRODUTO (MID-ROLL)
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    
    ## SUA MISSÃO
    Você está montando um roteiro de vídeo. Você já tem a INTRODUÇÃO e o CORPO principal.
    Agora você precisa inserir o CTA do produto no meio do roteiro (mid-roll).
    
    ## TAREFA
    1. Pegue a INTRODUÇÃO e o CORPO abaixo
    2. Insira o CTA do produto ENTRE eles ou logo após o corpo, de forma NATURAL e integrada ao fluxo
    3. Faça uma transição suave com frases como "Pausa rápida...", "Antes de continuar...", "E por falar nisso..."
    4. Apresente o CTA do produto de forma convincente mas não agressiva
    5. **RETORNE O ROTEIRO COMPLETO** até este ponto (Intro + Corpo + CTA Produto)
    
    ## CTA DO PRODUTO:
    ${config.productCTA}
    
    ## INTRODUÇÃO (já escrita):
    ${intro.substring(0, 15000)}
    
    ## CORPO PRINCIPAL (já escrito):
    ${body.substring(0, 15000)}
    
    ## RETORNE APENAS O ROTEIRO COMPLETO (INTRO + CORPO + CTA PRODUTO) SEM COMENTÁRIOS:
`;

export const getStep5Prompt = (config: ScriptConfiguration, partialScript: string) => `
    # PROMPT 5 - PATROCÍNIO E ENCERRAMENTO
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    
    ## SUA MISSÃO
    Você está finalizando um roteiro de vídeo. Você já tem todo o conteúdo até o CTA do produto.
    Agora você precisa adicionar o PATROCÍNIO/SPONSOR e o ENCERRAMENTO.
    
    ## TAREFA
    1. Pegue TODO o roteiro parcial abaixo (que já inclui intro, corpo e CTA produto)
    2. Após o conteúdo existente, adicione:
       a) CTA do PATROCINADOR de forma integrada e natural
       b) CONCLUSÃO do vídeo (resumo, call-to-action final, despedida)
    3. Use transições naturais antes do patrocínio ("Este vídeo é patrocinado por...", "Antes de finalizar...")
    4. A conclusão deve amarrar tudo e incentivar engajamento (like, comment, subscribe)
    5. **RETORNE O ROTEIRO COMPLETO E FINAL** (tudo que você recebeu + patrocínio + conclusão)
    
    ## CTA DO PATROCINADOR:
    ${config.sponsorCTA}
    
    ## ROTEIRO PARCIAL (até o CTA do produto):
    ${partialScript.substring(0, 30000)}
    
    ## RETORNE APENAS O ROTEIRO COMPLETO FINAL SEM COMENTÁRIOS OU EXPLICAÇÕES:
`;

export const getStep6Prompt = (config: ScriptConfiguration, script: string) => `
    # PROMPT 6 - AUDITORIA E CORREÇÃO FINAL
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    **TOM DE VOZ:** ${config.scriptStyle}
    
    ## SUA MISSÃO
    Você é um Auditor de Roteiros para Narração AI (ElevenLabs).
    
    ## TAREFA
    1. Analise o roteiro abaixo e identifique ERROS CRÍTICOS:
       - Placeholders genéricos ([NOME], {MARCA}, etc.)
       - Tags de cena não suportadas ([PAUSA], [RISOS], etc.)
       - URLs ou emails em formato digital
       - Abreviações não expandidas (Dr., Prof., etc.)
       - CTAs mal posicion ados ou confusos
       
    2. **SE HOUVER ERROS**: Reescreva o roteiro completo já CORRIGIDO
    3. **SE NÃO HOUVER ERROS**: Retorne o texto "✅ APROVADO - Roteiro sem erros" seguido do roteiro original
    
    ## FORMATO DE SAÍDA
    RETORNE APENAS O ROTEIRO FINAL (corrigido ou aprovado), SEM comentários, sem explicações, sem análises.
    Se houver correções, já incorpore no texto retornado.
    
    ## ROTEIRO PARA AUDITAR:
    ${script.substring(0, 50000)}
`;

export const getStep7Prompt = (config: ScriptConfiguration, fullScript: string) => `
    # PROMPT 7 - NORMALIZAÇÃO SSML PARA ELEVENLABS
    **IDIOMA OBRIGATÓRIO:** ${config.targetLanguage}
    
    ## SUA MISSÃO
    Você é um especialista em formatação SSML para síntese de voz (ElevenLabs).
    
    ## TAREFA
    Transforme o roteiro abaixo em formato SSML otimizado, seguindo estas regras:
    
    ### 1. ESTRUTURA SSML:
    - Envolva TUDO em \`<speak>\`...\`</speak>\`
    - Use \`<p>\` para parágrafos principais
    - Use \`<s>\` para sentenças/frases dentro de cada parágrafo
    
    ### 2. PAUSAS ESTRATÉGICAS:
    - Entre parágrafos: \`<break time="0.8s"/>\` ou \`<break time="1s"/>\`
    - Antes de revelações/pontos importantes: \`<break time="1.2s"/>\` 
    - Após CTAs: \`<break time="1.5s"/>\`
    - NÃO use pausas dentro de sentenças curtas
    
    ### 3. ÊNFASE:
    - Palavras-chave ou números importantes: \`<emphasis level="strong">texto</emphasis>\`
    - Títulos de produtos/nomes próprios: \`<emphasis level="moderate">BIOLIFT</emphasis>\`
    - Use com moderação (máximo 5-8 vezes no roteiro todo)
    
    ### 4. NÚMEROS E DATAS:
    - Escreva números por extenso: "três meses" NÃO "3 meses"  
    - Datas: "seis de dezembro de dois mil e vinte e cinco" NÃO "06/12/2025"
    - Porcentagens: "setenta por cento" NÃO "70%"
    
    ### 5. PROIBIÇÕES:
    - ❌ NÃO use tags \`<prosody>\`, \`<voice>\`, \`<sub>\` (não suportadas)
    - ❌ NÃO inclua comentários HTML \`<!-- -->\`
    - ❌ NÃO adicione instruções de cena ([PAUSA], [RISOS], etc.)
    - ❌ NÃO quebre no meio de frases
    
    ### 6. VALIDAÇÃO FINAL:
    - Remova URLs/emails: transforme em texto falado ("acesse nosso site growth suplementos ponto com")
    - Expanda abreviações: "Dr." → "Doutor", "Prof." → "Professor"
    - Remover símbolos: R$, $, %, etc. → escrever por extenso
    
    ## FORMATO DE SAÍDA
    RETORNE APENAS O SSML COMPLETO E VÁLIDO. Não inclua explicações antes ou depois.
    Comece com \`<speak>\` e termine com \`</speak>\`.
    
    ## ROTEIRO PARA NORMALIZAR:
    ${fullScript.substring(0, 50000)}
`;

export const getPromptFix = (roteiroComErros: string, listaErros: string[]) => `
    # PROMPT DE CORREÇÃO AUTOMÁTICA
    
    ## ERROS DETECTADOS:
    ${listaErros.map((erro, i) => `${i + 1}. ${erro}`).join('\n')}
    
    ## SUA TAREFA:
    Corrija TODOS os erros listados acima no roteiro abaixo.
    
    **IMPORTANTE**: 
    - Retorne APENAS o roteiro corrigido completo
    - NÃO inclua explicações, comentários ou análises
    - Mantenha a estrutura e flow do roteiro original
    - Corrija apenas os problemas identificados
    
    ## ROTEIRO COM ERROS:
    ${roteiroComErros.substring(0, 50000)}
    
    ## RETORNE APENAS O ROTEIRO CORRIGIDO:
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
# AGENTE CRIATIVO DE TEMAS PARA YOUTUBE - ANÁLISE ESTRUTURADA

## SUA MISSÃO
Você é um estrategista de conteúdo para YouTube especializado em identificar temas virais e criar estruturas completas de vídeo.

## CONTEXTO RECEBIDO
O usuário forneceu ideias, conceitos ou transcrições. Sua tarefa é transformar isso em uma lista estruturada de temas de vídeo PRONTOS PARA PRODUÇÃO.

## FORMATO DE SAÍDA OBRIGATÓRIO

Para CADA tema/ideia de vídeo, retorne EXATAMENTE neste formato:

---
### TEMA [número]: [Título do Vídeo - Claro e Específico]

**Subtemas** (3-5 pontos):
- [Subtema 1: aspecto específico a abordar]
- [Subtema 2: aspecto específico a abordar]  
- [Subtema 3: aspecto específico a abordar]

**Visão Geral**:
[2-3 linhas explicando o conceito central do vídeo, o problema que resolve ou a transformação que promove]

**Tipo de Canal Recomendado**: 
[Escolha UM: "🎭 Dark/Faceless (narrativa, sem aparecer)" OU "👤 Autoridade (personal brand, face-to-camera)"]

**Duração Recomendada**: 
[Ex: "8-10 minutos", "12-15 minutos", "5-7 minutos (short-form)"]

**Potencial de Viralização**: 
[Escolha: Alto / Médio / Baixo] - [Justificativa em 1 linha]

**Gancho de Abertura Sugerido**:
"[Primeira frase impactante que captura atenção nos primeiros 3 segundos]"

---

## INSTRUÇÕES ADICIONAIS

1. **Quantidade**: Gere de 5 a 10 temas completos (dependendo da riqueza do input)
2. **Variedade**: Se possível, varie entre temas para Dark e Autoridade
3. **Especificidade**: Evite temas genéricos. Seja específico e acionável.
4. **Tendências**: Se identificar ganchos de tendências atuais, mencione
5. **SEO**: Inclua palavras-chave naturalmente nos títulos

## EXEMPLO DE SAÍDA

---
### TEMA 1: Por Que Treinar Como Fisiculturista Está Te Deixando Fraco

**Subtemas**:
- Diferença entre força estética vs força funcional
- Como o treino de hipertrofia pode reduzir mobilidade
- Treinos de atletas reais vs bodybuilders
- Periodização para força + resistência + estética

**Visão Geral**:
Vídeo que desmistifica a crença de que músculos grandes = força real. Mostra como treinar exclusivamente para estética pode deixar o corpo disfuncional e propõe modelo híbrido de treino.

**Tipo de Canal Recomendado**: 
👤 Autoridade (personal brand, face-to-camera)

**Duração Recomendada**: 
10-12 minutos

**Potencial de Viralização**: 
Alto - Tema polêmico que confronta a indústria do fitness

**Gancho de Abertura Sugerido**:
"Treinar só por estética foi a maior burrice que eu cometi na minha vida - e vou te mostrar o porquê."

---

## INPUT DO USUÁRIO:
${inputText.substring(0, 30000)}

## RETORNE APENAS OS TEMAS ESTRUTURADOS CONFORME O FORMATO ACIMA:
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
