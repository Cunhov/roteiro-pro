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
