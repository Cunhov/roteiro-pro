import { ScriptConfiguration } from '../../../types';

/**
 * Thumbnail Planner Prompt
 * Generates thumbnail concepts and suggestions for YouTube videos
 */
export const getThumbnailPlannerPrompt = (theme: string, scriptSummary: string) => `
    # PROMPT - PLANEJADOR DE THUMBNAIL
    **Idioma:** Português (Brasil)
    
    ## CONTEXTO
    Tema do Vídeo: ${theme}
    Resumo do Roteiro: ${scriptSummary}
    
    ## SUA MISSÃO
    Crie sugestões de thumbnail que maximizem CTR (Click-Through Rate) no YouTube.
    
    ## TAREFA
    Sugira 3 conceitos de thumbnail, cada um com:
    - Texto principal (máximo 5 palavras)
    - Elementos visuais sugeridos
    - Paleta de cores
    - Expressão facial/pose recomendada (se aplicável)
    
    ## RETORNE AS 3 SUGESTÕES:
`;
