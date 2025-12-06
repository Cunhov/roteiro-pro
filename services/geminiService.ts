import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Initialize Gemini Client
// Note: We use process.env.API_KEY as strictly required.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Contents can be a simple string or an object/array for multimodal inputs
export const generateContent = async (contents: string | any, modelName: string = 'gemini-2.5-flash'): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API Key not found in environment variables.");
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents, // Directly pass the contents which might be { parts: [...] }
      config: {
        // High max tokens to ensure full scripts are generated
        maxOutputTokens: 8192,
        temperature: 0.7,
        // Disable safety settings to prevent "No text returned" on fitness/creative content
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      }
    });

    // Check for candidates
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini API");
    }

    const candidate = response.candidates[0];

    // Manual extraction to handle partial responses safely
    let text = candidate.content?.parts?.map(p => p.text).join('') || "";

    // If text is empty, check finish reason
    if (!text) {
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        throw new Error(`Gemini API stopped generation. Reason: ${candidate.finishReason}`);
      }
      throw new Error("No text returned from Gemini API");
    }

    // If we have text but it stopped due to MAX_TOKENS, we might want to append a note
    if (candidate.finishReason === 'MAX_TOKENS') {
      console.warn("Gemini API hit MAX_TOKENS. Returning partial text.");
      text += "\n\n[...A geração foi interrompida pois atingiu o limite de tamanho. O relatório pode estar incompleto...]";
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API Error: ${error.message || JSON.stringify(error)}`);
  }
};