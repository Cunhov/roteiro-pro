
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { LLMSettings, LLMProvider } from "../types";

/**
 * Universal Gateway for LLM Calls.
 * Routes requests based on specific provider settings for Text, Image, and Search.
 */
export class LLMGateway {
    private settings: LLMSettings;
    private geminiClients: Map<string, GoogleGenAI> = new Map();

    constructor(settings: LLMSettings) {
        this.settings = settings;
        this.initializeClients();
    }

    public updateSettings(newSettings: LLMSettings) {
        this.settings = newSettings;
        this.geminiClients.clear();
        this.initializeClients();
    }

    private initializeClients() {
        const geminiKey = this.settings.keys.gemini;
        if (geminiKey) {
            this.geminiClients.set('gemini', new GoogleGenAI({ apiKey: geminiKey }));
        }
    }

    private getClient(provider: LLMProvider): GoogleGenAI | null {
        if (provider === 'gemini') {
            return this.geminiClients.get('gemini') || null;
        }
        return null;
    }

    /**
     * Generates Text Content based on the selected TEXT provider
     */
    async generateText(prompt: string, systemInstruction?: string): Promise<string> {
        const provider = this.settings.textProvider;

        switch (provider) {
            case 'gemini':
                return this.generateGeminiText(prompt, systemInstruction);
            case 'poe':
                return this.generatePoeText(prompt, systemInstruction);
            case 'openai':
            case 'deepseek':
            case 'grok':
                return this.generateOpenAICompatibleText(provider, prompt, systemInstruction);
            case 'anthropic':
                return this.generateAnthropicText(prompt, systemInstruction);
            default:
                throw new Error(`Provider ${provider} not supported yet.`);
        }
    }

    /**
     * Generates Images based on the selected IMAGE provider
     */
    async generateImage(prompt: string, refImages?: string[]): Promise<string> {
        const provider = this.settings.imageProvider;

        switch (provider) {
            case 'gemini':
                return this.generateGeminiImage(prompt, refImages);
            case 'poe':
                return this.generatePoeImage(prompt);
            case 'openai':
                return this.generateOpenAIImage(prompt);
            default:
                throw new Error(`Image generation for provider '${provider}' is not currently supported or implemented.`);
        }
    }

    /**
     * Search for images (Grounding) based on selected SEARCH provider
     */
    async searchImages(query: string): Promise<string[]> {
        const provider = this.settings.searchProvider;

        if (provider === 'gemini') {
            return this.searchGeminiImages(query);
        }
        // Future: Implement Serper/Google Search API for other providers
        console.warn("Search/Grounding is currently only optimized for Gemini.");
        return [];
    }

    // =================================================================================
    // GEMINI IMPLEMENTATION (Native SDK)
    // =================================================================================

    private async generateGeminiText(prompt: string, systemInstruction?: string): Promise<string> {
        const client = this.getClient('gemini');
        if (!client) throw new Error("Gemini API Key missing.");

        try {
            const tools: any[] = [];
            const config: any = {
                systemInstruction: systemInstruction,
                maxOutputTokens: this.settings.maxOutputTokens || 8192,
                temperature: this.settings.temperature,
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
            };

            if (this.settings.enableSearch) tools.push({ googleSearch: {} });
            if (this.settings.enableThinking) config.thinkingConfig = { thinkingBudget: this.settings.thinkingBudget || 1024 };
            if (tools.length > 0) config.tools = tools;

            const response = await client.models.generateContent({
                model: this.settings.modelText,
                contents: prompt,
                config: config
            });

            const text = response.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || "";

            if (!text && response.candidates?.[0]?.finishReason === 'SAFETY') {
                throw new Error("Blocked by Safety Settings");
            }

            return text || "No response generated.";

        } catch (e: any) {
            console.error("Gemini Text Error", e);
            throw new Error(e.message || "Gemini Generation Failed");
        }
    }

    private async generateGeminiImage(prompt: string, refImages?: string[]): Promise<string> {
        const client = this.getClient('gemini');
        if (!client) throw new Error("Gemini API Key missing.");

        try {
            const parts: any[] = [];
            if (refImages && refImages.length > 0) {
                refImages.forEach(img => {
                    const [header, base64Data] = img.split(',');
                    const mimeType = header.split(':')[1].split(';')[0];
                    parts.push({ inlineData: { mimeType, data: base64Data } });
                });
            }
            parts.push({ text: prompt });

            const config: any = {};
            if (this.settings.imageAspectRatio) {
                config.imageConfig = { aspectRatio: this.settings.imageAspectRatio };
            }

            const response = await client.models.generateContent({
                model: this.settings.modelImage,
                contents: { parts },
                config: config
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            throw new Error("No image data returned from Gemini.");
        } catch (e: any) {
            throw new Error(e.message || "Gemini Image Generation Failed");
        }
    }

    private async searchGeminiImages(query: string): Promise<string[]> {
        const client = this.getClient('gemini');
        if (!client) return [];

        try {
            const response = await client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Encontre 1 imagem de alta qualidade (16:9) sobre: ${query}. Retorne a URL direta.`,
                config: { tools: [{ googleSearch: {} }] }
            });

            const urls: string[] = [];
            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            chunks.forEach((chunk: any) => {
                if (chunk.web?.uri && chunk.web.uri.match(/\.(jpeg|jpg|png|webp)/i)) {
                    urls.push(chunk.web.uri);
                }
            });
            return urls;
        } catch (e) {
            return [];
        }
    }

    // =================================================================================
    // POE IMPLEMENTATION (OpenAI Compatible + Extra Body)
    // =================================================================================

    private async generatePoeText(prompt: string, systemInstruction?: string): Promise<string> {
        const apiKey = this.settings.keys.poe;
        if (!apiKey) throw new Error("Poe API Key missing.");

        const messages = [];
        if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
        messages.push({ role: 'user', content: prompt });

        const extraBody: any = {};
        if (this.settings.enableSearch) extraBody.web_search = true;
        if (this.settings.enableThinking) {
            extraBody.thinking_budget = this.settings.thinkingBudget;
            extraBody.reasoning_effort = "high";
        }

        try {
            const response = await fetch('https://api.poe.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.settings.modelText,
                    messages: messages,
                    stream: false,
                    temperature: this.settings.temperature,
                    max_tokens: this.settings.maxOutputTokens,
                    extra_body: Object.keys(extraBody).length > 0 ? extraBody : undefined
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Poe API Error (${response.status}): ${err}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "";
        } catch (e: any) {
            throw new Error(`Poe Generation Failed: ${e.message}`);
        }
    }

    private async generatePoeImage(prompt: string): Promise<string> {
        const apiKey = this.settings.keys.poe;
        if (!apiKey) throw new Error("Poe API Key missing.");

        try {
            // POE uses the images/generations endpoint, not chat/completions for images
            const response = await fetch('https://api.poe.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.settings.modelImage,
                    prompt: prompt,
                    aspect_ratio: this.settings.imageAspectRatio || "16:9"
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Poe Image API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            // POE returns image URL in data array
            if (data.data && data.data[0] && data.data[0].url) {
                return data.data[0].url;
            }

            throw new Error("No image URL found in Poe response.");
        } catch (e: any) {
            throw new Error(`Poe Image Generation Failed: ${e.message}`);
        }
    }

    // =================================================================================
    // OPENAI / DEEPSEEK / GROK IMPLEMENTATION (Generic OpenAI-Compatible)
    // =================================================================================

    private async generateOpenAICompatibleText(provider: LLMProvider, prompt: string, systemInstruction?: string): Promise<string> {
        const apiKey = this.settings.keys[provider];
        if (!apiKey) throw new Error(`${provider.toUpperCase()} API Key missing.`);

        let baseUrl = '';
        if (provider === 'openai') baseUrl = 'https://api.openai.com/v1';
        if (provider === 'deepseek') baseUrl = 'https://api.deepseek.com';
        if (provider === 'grok') baseUrl = 'https://api.x.ai/v1';

        const messages = [];
        if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
        messages.push({ role: 'user', content: prompt });

        // Clean params for strict providers
        const body: any = {
            model: this.settings.modelText,
            messages: messages,
            temperature: this.settings.temperature,
            max_tokens: this.settings.maxOutputTokens,
        };

        // DeepSeek Specifics
        if (provider === 'deepseek' && this.settings.modelText.includes('reasoner')) {
            delete body.temperature; // R1 doesn't support temp usually
        }

        try {
            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`${provider.toUpperCase()} API Error (${response.status}): ${err}`);
            }

            const data = await response.json();
            // DeepSeek sometimes puts reasoning in 'reasoning_content'
            const content = data.choices?.[0]?.message?.content || "";
            const reasoning = data.choices?.[0]?.message?.reasoning_content;

            if (reasoning && this.settings.enableThinking) {
                return `[Thinking Process]\n${reasoning}\n\n[Response]\n${content}`;
            }

            return content;
        } catch (e: any) {
            throw new Error(`${provider} Generation Failed: ${e.message}`);
        }
    }

    private async generateOpenAIImage(prompt: string): Promise<string> {
        const apiKey = this.settings.keys.openai;
        if (!apiKey) throw new Error("OpenAI API Key missing.");

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "dall-e-3", // Force DALL-E 3 for quality
                    prompt: prompt,
                    n: 1,
                    size: "1024x1024",
                    quality: "standard"
                })
            });

            if (!response.ok) throw new Error(`OpenAI Image Error: ${response.status}`);
            const data = await response.json();
            return data.data?.[0]?.url || "";
        } catch (e: any) {
            throw new Error(`OpenAI Image Failed: ${e.message}`);
        }
    }

    // =================================================================================
    // ANTHROPIC IMPLEMENTATION (Direct API)
    // =================================================================================

    private async generateAnthropicText(prompt: string, systemInstruction?: string): Promise<string> {
        const apiKey = this.settings.keys.anthropic;
        if (!apiKey) throw new Error("Anthropic API Key missing.");

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                    'anthropic-dangerous-direct-browser-access': 'true' // Necessary for client-side apps
                },
                body: JSON.stringify({
                    model: this.settings.modelText,
                    max_tokens: this.settings.maxOutputTokens || 4096,
                    temperature: this.settings.temperature,
                    system: systemInstruction,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Anthropic API Error (${response.status}): ${err}`);
            }

            const data = await response.json();
            // Anthropic returns content array
            if (data.content && Array.isArray(data.content)) {
                return data.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
            }
            return "";

        } catch (e: any) {
            throw new Error(`Anthropic Generation Failed: ${e.message}`);
        }
    }
}
