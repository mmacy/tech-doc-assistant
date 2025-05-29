
import { LlmProvider, LlmServiceOptions, LlmServiceResponse } from '../types';
import geminiService from './geminiService';
import azureOpenaiService from './azureOpenaiService';
import openaiService from './openaiService';

export const generateDocumentation = async (
  provider: LlmProvider,
  apiKey: string | null,
  prompt: string,
  options?: LlmServiceOptions
): Promise<LlmServiceResponse> => {

  switch (provider) {
    case LlmProvider.GEMINI:
      // Gemini service handles its own grounding option internally if passed via generateDocumentationWithGrounding
      // Pass the entire options object, as generateDocumentationWithGrounding accepts LlmServiceOptions
      if ('generateDocumentationWithGrounding' in geminiService) {
         return geminiService.generateDocumentationWithGrounding(apiKey, prompt, options?.useGrounding);
      }
      // Fallback (should not happen with current geminiService structure)
      return geminiService.generateDocumentation(apiKey, prompt, options);

    case LlmProvider.AZURE_OPENAI:
      if (options?.useGrounding) {
        console.warn("Grounding is not supported for Azure OpenAI.");
      }
      // Pass the full options object, azureOpenaiService will pick what it needs (azureEndpoint, azureDeploymentName)
      return azureOpenaiService.generateDocumentation(apiKey, prompt, options);

    case LlmProvider.OPENAI:
      if (options?.useGrounding) {
        console.warn("Grounding is not supported for OpenAI.");
      }
      // Pass the full options object, openaiService will pick what it needs (openaiModelName)
      return openaiService.generateDocumentation(apiKey, prompt, options);

    default:
      // This line performs the compile-time exhaustiveness check.
      // If 'provider' can be a value not covered by the cases (e.g., if LlmProvider enum is extended
      // without updating this switch), this line will cause a compile-time error.
      const _exhaustiveCheckHelper: never = provider;
      // If the above line compiles, TypeScript has determined that 'provider' must be 'never'
      // in this code path, meaning all known cases were handled.
      // We use 'provider as string' for the error message to avoid potential issues with
      // interpolating a variable of type 'never' directly, which might be causing the obscure error.
      throw new Error(`Unsupported LLM provider: ${provider as string}`);
  }
};
