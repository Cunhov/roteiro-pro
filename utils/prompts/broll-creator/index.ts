/**
 * B-Roll Creator Prompt
 * Segments script/SRT into timestamped visual descriptions for image generation/search
 */

export const getBRollSegmentationPrompt = (
    text: string,
    pacing: string,
    sourcePref: string,
    mood?: string,
    style?: string
) => `
# AGENTE B-ROLL - Segmentação e Descrição Visual

## SUA MISSÃO
Analise o roteiro/legenda fornecido e crie uma sequência de B-Rolls (imagens de apoio visual).
Retorne um JSON estruturado com segmentos visuais contendo timestamps e descrições.

## PARÂMETROS
- **Ritmo:** ${pacing} (fast=5-15s, medium=15-30s, slow=30-60s, auto=decidir)
- **Fonte Preferencial:** ${sourcePref} (search=buscar na web, generate=criar com IA, mixed=decidir)
- **Mood:** ${mood || 'Neutro'}
- **Estilo:** ${style || 'Realista'}

## REGRAS DE SEGMENTAÇÃO

### 1. Duração dos Segmentos
- **Fast:** 5-15 segundos por segmento
- **Medium:** 15-30 segundos por segmento  
- **Slow:** 30-60 segundos por segmento
- **Auto:** Decida baseado no conteúdo (ação rápida = curto, teoria = longo)

### 2. Tipo de Fonte (sourceType)
- **"search"** - Use quando:
  - Lugares conhecidos ("Torre Eiffel", "São Paulo")
  - Objetos comuns ("MacBook Pro", "Tesla Model 3")
  - Eventos reais
- **"generate"** - Use quando:
  - Conceitos abstratos ("motivação", "sucesso")
  - Cenários ficcionais ou futuristas
  - Composições específicas que não existem em foto

### 3. Descrições Visuais
- **Para search:** Seja específico e literal ("Golden Gate Bridge at sunset")
- **Para generate:** Seja detalhado e criativo ("A confident businessman standing on mountain peak, dramatic lighting, inspirational mood, 8K cinematic")

### 4. Contexto do Texto
- Extraia a frase literal do roteiro que corresponde ao segmento

## FORMATO DE SAÍDA (JSON ESTRITO)

RETORNE APENAS UM ARRAY JSON SEM MARKDOWN, seguindo este formato:

[
  {
    "id": "001",
    "timestampStart": "00:00:00,000",
    "timestampEnd": "00:00:15,000",
    "textContext": "Hoje vou te mostrar como triplicar sua produtividade",
    "visualDescription": "Modern workspace with multiple monitors, productivity dashboard on screen, sleek minimalist setup, professional lighting",
    "sourceType": "generate"
  },
  {
    "id": "002",
    "timestampStart": "00:00:15,000",
    "timestampEnd": "00:00:30,000",
    "textContext": "Muitas pessoas trabalham 12 horas mas não produzem nada",
    "visualDescription": "Tired office worker at messy desk, frustrated expression, cluttered workspace",
    "sourceType": "generate"
  }
]

## IMPORTANTE
- Timestamps no formato SRT: HH:MM:SS,mmm
- IDs sequenciais com 3 dígitos (001, 002, 003...)
- Array JSON puro, SEM ```json``` ou markdown
- Mínimo de 3 segmentos, máximo de 20
- Se o texto tiver timestamps SRT, use-os. Senão, crie baseado no ritmo

---

## TEXTO/ROTEIRO PARA SEGMENTAR:

${text.substring(0, 50000)}

---

## RETORNE APENAS O ARRAY JSON:
`;
