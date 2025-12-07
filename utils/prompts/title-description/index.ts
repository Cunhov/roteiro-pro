/**
 * Title & Description Generator Prompts
 */

export const getDescriptionAgentPrompt = (transcription: string) => `
# AGENTE DE DESCRIÇÕES PARA YOUTUBE - SEO MÁXIMO

## MISSÃO
Crie uma descrição completa e otimizada para SEO no YouTube.

## ESTRUTURA DA DESCRIÇÃO

### SEÇÃO 1: RESUMO ATRAENTE (3-4 linhas)
- Resuma o valor do vídeo de forma persuasiva
- Use emojis estratégicos (2-3)
- Inclua palavra-chave principal na primeira linha

### SEÇÃO 2: CAPÍTULOS DO VÍDEO (TIMESTAMPS)
Crie uma lista de capítulos com timestamps.
- Formato: MM:SS Nome do Capítulo Descritivo e com Palavra-Chave
- O primeiro timestamp deve ser sempre 00:00

### SEÇÃO 3: SEO DETALHADO
1. Palavras-chave Principais: 5-7 palavras-chave centrais
2. Palavras-chave de Cauda Longa: 7-10 frases específicas
3. Tags para YouTube: 20-25 tags separadas por vírgula
4. Hashtags: 3-5 hashtags concisas

## INPUT TRANSCRIPTION:
${transcription.substring(0, 60000)}
`;

export const getTitleAgentPrompt = (transcription: string) => `
# MESTRE EM COPYWRITING - TÍTULOS PARA YOUTUBE

## PERSONA
Você é um especialista em copywriting para YouTube, focado em CTR máximo.

## TAREFA
Gere 8 a 10 opções de títulos organizados nestas categorias:
- Comprimento Ideal: menos de 60 caracteres
- Uso de CAPS em 1-2 palavras
- Use palavras de poder

### CATEGORIAS DE TÍTULOS

**1. Título Direto e Otimizado para SEO**
Ex: "JEJUM INTERMITENTE: Guia Completo Para Iniciantes em 2024"

**2. Título de Curiosidade / Lacuna de Informação**
Ex: "O Que NINGUÉM Te Contou Sobre Tomar Café em Jejum"

**3. Título Focado em Benefício / Transformação**
Ex: "Perca Gordura Abdominal RÁPIDO com Este Protocolo"

**4. Título Numérico / Lista**
Ex: "Os 5 PIORES Erros que Impedem Você de Ganhar Músculos"

**5. Título de Confronto / Polêmica**
Ex: "Por que a Dieta Cetogênica é uma FARSA"

**6. Título em Formato de Pergunta**
Ex: "Você Realmente Precisa de 8 Horas de Sono por Noite?"

## INPUT TRANSCRIPTION:
${transcription.substring(0, 60000)}
`;
