
export enum LlmProvider {
  GEMINI = 'Google Gemini',
  AZURE_OPENAI = 'Azure OpenAI',
  OPENAI = 'OpenAI', // Added standard OpenAI
}

export interface DocumentType {
  id: string;
  name: string;
  templatePath: string; 
  descriptionPath: string;
}

export interface LlmServiceOptions {
  useGrounding?: boolean;
  azureEndpoint?: string;
  azureDeploymentName?: string; 
  openaiModelName?: string; // Added for OpenAI model selection
}

export interface LlmServiceResponse {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface LlmService {
  generateDocumentation: (
    apiKey: string | null,
    prompt: string,
    options?: LlmServiceOptions 
  ) => Promise<LlmServiceResponse>; 
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}

export interface DocumentTypeSetting {
  template: string;
  description: string;
}

export interface AllDocumentTypeSettings {
  [documentTypeId: string]: DocumentTypeSetting;
}