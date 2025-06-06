import { AzureOpenAI } from "openai";
import { LlmService, LlmServiceOptions, LlmServiceResponse } from '../types';
import {
  AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME,
} from '../constants';

const azureOpenaiService: LlmService = {
  generateDocumentation: async (
    apiKey: string | null,
    prompt: string,
    options?: LlmServiceOptions
  ): Promise<LlmServiceResponse> => {
    const effectiveApiKey = apiKey || process.env.AZURE_OPENAI_API_KEY;
    const effectiveEndpoint = options?.azureEndpoint || process.env.AZURE_OPENAI_ENDPOINT;
    // Fallback order: options -> environment variable -> constant
    const deploymentName = options?.azureDeploymentName || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME;

    if (!effectiveApiKey) {
      console.warn(`Azure OpenAI API key not provided by user and not in env. AZURE_OPENAI_API_KEY.`);
       return { text: `# Mock Azure OpenAI Response (No API Key)\n\nThis is a mock response. An API key is required for Azure OpenAI.`};
    }
    if (!effectiveEndpoint) {
       console.warn(`Azure OpenAI Endpoint not provided by user and not in env. AZURE_OPENAI_ENDPOINT.`);
       return { text: `# Mock Azure OpenAI Response (No Endpoint)\n\nThis is a mock response. An endpoint is required for Azure OpenAI.`};
    }
     if (deploymentName === AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME && !process.env.AZURE_OPENAI_DEPLOYMENT_NAME && !options?.azureDeploymentName) {
      console.warn(`Azure OpenAI Deployment Name not provided by user or in env. AZURE_OPENAI_DEPLOYMENT_NAME. Using default: ${AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME}. This may need configuration for your specific Azure resource.`);
    }

    const client = new AzureOpenAI({
      endpoint: effectiveEndpoint,
      apiKey: effectiveApiKey,
      dangerouslyAllowBrowser: true,
      apiVersion: "2024-12-01-preview" // Use a recent API version
    });

    try {
      const messages = [{ role: "user" as const, content: prompt }];
      console.log(`Using Azure OpenAI with: Endpoint='${effectiveEndpoint}', Deployment='${deploymentName}'`);

      const baseParams = {
        model: deploymentName,
        messages,
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

      const result = await client.chat.completions.create(baseParams);

      const text = result.choices[0]?.message?.content;
      if (typeof text !== 'string') {
        console.error("Azure OpenAI API response.text is not a string:", result);
        throw new Error("Received an unexpected response format from Azure OpenAI API (text was not a string).");
      }
      return { text };
    } catch (error: any) {
      console.error("Error calling Azure OpenAI API:", error);
      throw new Error(`Azure OpenAI API error: ${error.message || 'Unknown error'}`);
    }
  },
};

export default azureOpenaiService;
