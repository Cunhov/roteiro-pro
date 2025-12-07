import { ScriptConfiguration } from '../../../types';

/**
 * STEP 5: SSML Formatting (previously Step 7)
 * Final step that converts plain text script to SSML for ElevenLabs
 */
export const getStep5Prompt = (config: ScriptConfiguration, fullScript: string) => `
    # PROMPT 5 - NORMALIZAÇÃO SSML PARA ELEVENLABS
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
    - Títulos de produtos/nomes próprios: \`<emphasis level="moderate">PRODUTO</emphasis>\`
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
