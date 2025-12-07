export const getBRollSegmentationPrompt = (text: string, pacing: string, sourcePref: string, mood?: string, style?: string) => `
    # AGENTE B-ROLL
    Ritmo: ${pacing}. Fonte: ${sourcePref}. Mood: ${mood}.
    Entrada: ${text.substring(0, 50000)}
`;
