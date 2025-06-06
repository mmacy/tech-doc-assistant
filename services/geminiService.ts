
import { GoogleGenAI, GenerateContentResponse, GroundingChunk as GeminiApiGroundingChunk } from "@google/genai";
import { LlmService, LlmServiceOptions, LlmServiceResponse, GroundingChunk as AppGroundingChunk } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

// Assuming GeminiApiGroundingChunk and AppGroundingChunk are structurally compatible
// as per previous comments in the codebase. A simple cast will be used.

const geminiService: LlmService & {
  generateDocumentationWithGrounding: (
    apiKey: string | null,
    prompt: string,
    useGrounding?: boolean
  ) => Promise<LlmServiceResponse>;
} = {
  // This method MUST match the LlmService interface signature
  generateDocumentation: async function (
    apiKey: string | null,
    prompt: string,
    options?: LlmServiceOptions // Added options parameter
  ): Promise<LlmServiceResponse> { // Changed return type
    // `this` refers to the `geminiService` object.
    // Pass the useGrounding option from LlmServiceOptions.
    // The generateDocumentationWithGrounding method already returns LlmServiceResponse.
    return this.generateDocumentationWithGrounding(apiKey, prompt, options?.useGrounding);
  },

  generateDocumentationWithGrounding: async (
    apiKey: string | null,
    prompt: string,
    useGrounding: boolean = false
  ): Promise<LlmServiceResponse> => {
    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!effectiveApiKey) {
      throw new Error("API key for Google Gemini is not provided and not found in environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    
    try {
      const requestConfig: any = { 
        model: GEMINI_MODEL_NAME,
        contents: prompt,
        config: {} 
      };

      if (useGrounding) {
        requestConfig.config.tools = [{ googleSearch: {} }];
      }
      
      const response: GenerateContentResponse = await ai.models.generateContent(requestConfig);
      
      const text = response.text; 
      if (typeof text !== 'string') {
        console.error("Gemini API response.text is not a string:", response);
        throw new Error("Received an unexpected response format from Gemini API (text was not a string).");
      }
      
      // Cast SDK's GroundingChunk to app's GroundingChunk type. Assumed structurally compatible.
      const groundingChunks: AppGroundingChunk[] | undefined = response.candidates?.[0]?.groundingMetadata?.groundingChunks as AppGroundingChunk[] | undefined;

      return { text, groundingChunks };

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
      }
      throw new Error("An unknown error occurred with the Gemini API.");
    }
  }
};

export default geminiService;
