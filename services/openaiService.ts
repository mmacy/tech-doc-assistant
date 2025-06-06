import { OpenAI } from "openai";
import { LlmService, LlmServiceOptions, LlmServiceResponse } from '../types';
import { OPENAI_MODEL_NAME as DEFAULT_MODEL_CONSTANT } from '../constants'; // Renamed for clarity

const openaiService: LlmService = {
  generateDocumentation: async (
    apiKey: string | null,
    prompt: string,
    options?: LlmServiceOptions
  ): Promise<LlmServiceResponse> => {
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;
    // Fallback order: options -> environment variable -> constant
    const modelName = options?.openaiModelName || process.env.OPENAI_MODEL_NAME || DEFAULT_MODEL_CONSTANT;

    if (!effectiveApiKey) {
      console.warn("OpenAI API key is not provided by user and not found in process.env.OPENAI_API_KEY.");
      return {
        text: `# Mock OpenAI Response (No API Key)\n\nThis is a mock response because no OpenAI API key was available.\n\nUsing model: ${modelName}\nPrompt received:\n${prompt.substring(0, 200)}...`
      };
    }

    const client = new OpenAI({
        apiKey: effectiveApiKey,
        dangerouslyAllowBrowser: true
    });

    try {
      console.log(`Using OpenAI with: Model='${modelName}'`);
      const baseParams = {
        messages: [{ role: "user" as const, content: prompt }],
        model: modelName,
      } as const;

      if (options?.onStreamToken) {
        const stream = await client.chat.completions.create({
          ...baseParams,
          stream: true,
        });

        let text = "";
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            text += token;
            options.onStreamToken(token);
          }
        }
        return { text };
      }

      const chatCompletion = await client.chat.completions.create(baseParams);

      const text = chatCompletion.choices[0]?.message?.content;
      if (typeof text !== 'string') {
        console.error("OpenAI API response.text is not a string:", chatCompletion);
        throw new Error("Received an unexpected response format from OpenAI API (text was not a string).");
      }
      return { text };
    } catch (error: any) {
      console.error("Error calling OpenAI API:", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      }
      throw new Error(`OpenAI API error: ${error.message || 'Unknown error'}`);
    }
  },
};

export default openaiService;
