/**
 * Niche Analyzer Prompts
 */

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
