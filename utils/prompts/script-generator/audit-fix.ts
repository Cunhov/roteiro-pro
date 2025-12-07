import { ScriptConfiguration } from '../../../types';

/**
 * Audit prompt - used for post-processing validation and correction
 */
export const getAuditPrompt = (config: ScriptConfiguration, script: string) => `
    # PROMPT - AUDITORIA E CORREÇÃO FINAL
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
       - CTAs mal posicionados ou confusos
       
    2. **SE HOUVER ERROS**: Reescreva o roteiro completo já CORRIGIDO
    3. **SE NÃO HOUVER ERROS**: Retorne o texto "✅ APROVADO - Roteiro sem erros" seguido do roteiro original
    
    ## FORMATO DE SAÍDA
    RETORNE APENAS O ROTEIRO FINAL (corrigido ou aprovado), SEM comentários, sem explicações, sem análises.
    Se houver correções, já incorpore no texto retornado.
    
    ## ROTEIRO PARA AUDITAR:
    ${script.substring(0, 50000)}
`;

/**
 * Fix prompt - used for auto-correction when validation fails
 */
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
