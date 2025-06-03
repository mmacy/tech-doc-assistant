
import React, { useState, useCallback, useEffect } from 'react';
import { LlmProvider, DocumentType, GroundingChunk, AllDocumentTypeSettings, DocumentTypeSetting, LlmServiceOptions } from './types';
import { DOCUMENT_TYPES, DEFAULT_AZURE_OPENAI_ENDPOINT_PLACEHOLDER, DEFAULT_AZURE_OPENAI_DEPLOYMENT_NAME_PLACEHOLDER, OPENAI_MODEL_NAME, AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME } from './constants';
import SelectInput from './components/SelectInput';
import TextAreaInput from './components/TextAreaInput';
import Button from './components/Button';
import MarkdownDisplay from './components/MarkdownDisplay';
import SettingsModal from './components/SettingsModal';
import { generateDocumentation as llmGenerateDocumentation } from './services/llmService';
import {
  getMarkdownStyleGuide,
  getGeneralWritingStyleGuide,
  getDocumentTemplate,
  getDocumentDescription
} from './services/contentService';

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.019.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.894Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const App: React.FC = () => {
  const [selectedLlmProvider, setSelectedLlmProvider] = useState<LlmProvider>(LlmProvider.GEMINI);
  const [apiKey, setApiKey] = useState<string>('');
  const [azureOpenaiEndpoint, setAzureOpenaiEndpoint] = useState<string>('');
  const [azureOpenaiDeploymentName, setAzureOpenaiDeploymentName] = useState<string>('');
  const [openaiModelName, setOpenaiModelName] = useState<string>('');

  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<string>(DOCUMENT_TYPES[0]?.id || '');
  const [draftContent, setDraftContent] = useState<string>('');
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useGrounding, setUseGrounding] = useState<boolean>(false);
  const [groundingSources, setGroundingSources] = useState<GroundingChunk[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  const [markdownStyleGuide, setMarkdownStyleGuide] = useState<string>(() => getMarkdownStyleGuide());
  const [generalWritingStyleGuide, setGeneralWritingStyleGuide] = useState<string>(() => getGeneralWritingStyleGuide());
  const [documentCustomSettings, setDocumentCustomSettings] = useState<AllDocumentTypeSettings>(() => {
    return DOCUMENT_TYPES.reduce((acc, docType) => {
      acc[docType.id] = {
        template: getDocumentTemplate(docType.id) || '',
        description: getDocumentDescription(docType.id) || '',
      };
      return acc;
    }, {} as AllDocumentTypeSettings);
  });

  const llmProviderOptions = Object.values(LlmProvider).map(provider => ({ value: provider, label: provider }));
  const documentTypeOptions = DOCUMENT_TYPES.map(docType => ({ value: docType.id, label: docType.name }));

  const handleDocumentTypeSettingChange = (docTypeId: string, field: keyof DocumentTypeSetting, value: string) => {
    setDocumentCustomSettings(prev => ({
      ...prev,
      [docTypeId]: {
        ...(prev[docTypeId] || { template: '', description: '' }),
        [field]: value,
      }
    }));
  };

  const constructPrompt = useCallback(() => {
    const selectedDocType = DOCUMENT_TYPES.find(dt => dt.id === selectedDocumentTypeId);
    if (!selectedDocType) return '';
    const template = documentCustomSettings[selectedDocType.id]?.template || '';
    const description = documentCustomSettings[selectedDocType.id]?.description || '';

    return `
You are an expert technical writer. Your task is to create and edit usage documentation for a developer audience.

Write a complete, polished technical document in Markdown format based on the provided draft and implementing the style and format guidance.

**Key instructions:**

1.  **Adhere strictly to Markdown styling:** Follow all rules in the "MARKDOWN STYLING RULES" section below.
2.  **Follow writing style:** Adhere to the "GENERAL WRITING STYLE GUIDE" provided.
3.  **Implement document template:** Structure the document as specified in "DOCUMENT STRUCTURE TEMPLATE" for the type: "${selectedDocType.name}".
4.  **Incorporate draft:** Integrate the "USER'S DRAFT CONTENT" into the new document as specified by the template.
5.  **Apply additional instructions:** Consider any "USER'S ADDITIONAL INSTRUCTIONS". If additional instructions were given, apply its guidance even if it conflicts with the template or other guidance.
6.  **Fill placeholders:** Replace placeholders like \`{{TITLE}}\`, \`{{CONCEPT_NAME}}\`, etc., in the template with relevant information derived from the user's draft or instructions. If information is missing, make reasonable inferences or state that information is needed.
7.  **Output format:** The entire output MUST be in valid Markdown. Do not include any conversational text before or after the Markdown document, nor enclose the output in \`\`\`markdown\`\`\` tags.

---
**DOCUMENT TYPE DESCRIPTION: ${selectedDocType.name}**
${description}
---
**DOCUMENT STRUCTURE TEMPLATE: ${selectedDocType.name}**
\`\`\`markdown
${template}
\`\`\`
---
**USER'S DRAFT CONTENT:**
\`\`\`
${draftContent}
\`\`\`
---
**USER'S ADDITIONAL INSTRUCTIONS (if any):**
${additionalInstructions || "None given."}
---
**MARKDOWN STYLING RULES:**
${markdownStyleGuide}
---
**GENERAL WRITING STYLE GUIDE:**
${generalWritingStyleGuide}
---

Now, generate the complete Markdown document based on the above information.
    `;
  }, [selectedDocumentTypeId, draftContent, additionalInstructions, markdownStyleGuide, generalWritingStyleGuide, documentCustomSettings]);

  const handleGenerate = async () => {
    if (!draftContent.trim()) {
      setError("Draft content cannot be empty.");
      return;
    }
    if (!selectedDocumentTypeId && DOCUMENT_TYPES.length > 0) {
        setError("Select a doc type.");
        return;
    } else if (DOCUMENT_TYPES.length === 0) {
        setError("No document types are configured - check Settings.");
        return;
    }

    setError(null);
    setIsLoading(true);
    setGeneratedMarkdown('');
    setGroundingSources([]);

    const prompt = constructPrompt();
    if (!prompt) {
      setError("Failed to construct prompt - check document type selection.");
      setIsLoading(false);
      return;
    }

    const llmOptions: LlmServiceOptions = {
      useGrounding: selectedLlmProvider === LlmProvider.GEMINI && useGrounding,
    };

    if (selectedLlmProvider === LlmProvider.AZURE_OPENAI) {
      llmOptions.azureEndpoint = azureOpenaiEndpoint || process.env.AZURE_OPENAI_ENDPOINT;
      llmOptions.azureDeploymentName = azureOpenaiDeploymentName || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME;
    }
    if (selectedLlmProvider === LlmProvider.OPENAI) {
      llmOptions.openaiModelName = openaiModelName || process.env.OPENAI_MODEL_NAME || OPENAI_MODEL_NAME;
    }

    try {
      const { text, groundingChunks } = await llmGenerateDocumentation(
        selectedLlmProvider,
        apiKey,
        prompt,
        llmOptions
      );
      setGeneratedMarkdown(text);
      if (groundingChunks && groundingChunks.length > 0) {
        setGroundingSources(groundingChunks);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during generation.");
      }
      console.error("Generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileName = () => {
    const docType = DOCUMENT_TYPES.find(dt => dt.id === selectedDocumentTypeId)?.name || 'document';
    return `${docType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.md`;
  };

  useEffect(() => {
    setApiKey('');
    setAzureOpenaiEndpoint('');
    setAzureOpenaiDeploymentName('');
    setOpenaiModelName('');
    setUseGrounding(false);
  }, [selectedLlmProvider]);

   useEffect(() => {
    if (DOCUMENT_TYPES.length > 0 && !selectedDocumentTypeId) {
      setSelectedDocumentTypeId(DOCUMENT_TYPES[0].id);
    }
     setDocumentCustomSettings(prevSettings => {
        const newSettings = { ...prevSettings };
        let changed = false;
        DOCUMENT_TYPES.forEach(docType => {
            if (!newSettings[docType.id]) {
                newSettings[docType.id] = {
                    template: getDocumentTemplate(docType.id) || '',
                    description: getDocumentDescription(docType.id) || '',
                };
                changed = true;
            }
        });
        return changed ? newSettings : prevSettings;
     });

  }, [selectedDocumentTypeId]);


  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400">Tech Doc Assistant</h1>
        <p className="mt-3 text-lg text-[#A0AEC0] max-w-2xl mx-auto">
          Let AI help you author clear, accurate, and findable tech docs for developers. Select a doc type, provide your draft, and let the LLM write the first draft.
        </p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-[#152B43] p-6 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-[#2D3748] pb-3">
            <h2 className="text-2xl font-semibold text-sky-400">Source content</h2>
            <Button
                variant="secondary"
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-3 py-2"
                aria-label="Open LLM settings"
                icon={<SettingsIcon className="w-5 h-5" />}
            >
                Settings
            </Button>
          </div>

          {DOCUMENT_TYPES.length > 0 ? (
            <SelectInput
              id="documentType"
              label="1. Select document type"
              value={selectedDocumentTypeId}
              onChange={(e) => setSelectedDocumentTypeId(e.target.value)}
              options={documentTypeOptions}
            />
          ) : (
            <div className="mb-4 p-3 bg-[#243B53] border border-[#4A5568] rounded-md">
              <p className="text-sm font-medium text-[#E2E8F0] mb-1">1. Select a doc type</p>
              <p className="text-[#A0AEC0] text-sm">No document types configured.</p>
            </div>
          )}

          <TextAreaInput
            id="draftContent"
            label="2. Rought draft or existing content"
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Paste or write your raw content, ideas, or notes here..."
            rows={10}
            required
          />

          <TextAreaInput
            id="additionalInstructions"
            label="3. Additional instructions (optional)"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="e.g. 'Focus on a beginner audience', 'Emphasize the security aspects', 'Target API version 2.1'"
            rows={4}
          />

          <Button
            onClick={handleGenerate}
            isLoading={isLoading}
            disabled={isLoading || !draftContent.trim() || (DOCUMENT_TYPES.length > 0 && !selectedDocumentTypeId) || DOCUMENT_TYPES.length === 0}
            className="w-full mt-2 text-lg"
          >
            {isLoading ? 'Generating...' : 'Generate documentation'}
          </Button>

          {error && <p className="mt-4 text-sm text-red-400 bg-red-900/30 p-3 rounded-md">{error}</p>}

        </section>

        <section className="bg-[#152B43] p-6 rounded-xl shadow-2xl md:sticky md:top-8 md:self-start" style={{maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto'}}>
           <h2 className="text-2xl font-semibold text-sky-400 mb-6 border-b border-[#2D3748] pb-3">Generated content</h2>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-[#A0AEC0]">
              <svg className="animate-spin h-12 w-12 text-sky-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg">Generating your document...</p>
              <p className="text-sm">This might take a few minutes.</p>
            </div>
          )}
          {!isLoading && !generatedMarkdown && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-[#A0AEC0] border-2 border-dashed border-[#2D3748] rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-lg">Your generated document will appear here.</p>
              <p className="text-sm">Fill in the details on the left and click "Generate".</p>
            </div>
          )}
          <MarkdownDisplay markdownContent={generatedMarkdown} fileName={getFileName()} />
          {groundingSources.length > 0 && (
            <div className="mt-6 p-4 bg-[#243B53] rounded-lg">
              <h4 className="text-md font-semibold text-sky-400 mb-2">Grounding sources (from Google Search):</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {groundingSources.map((chunk, index) => {
                  const source = chunk.web || chunk.retrievedContext;
                  if (source?.uri) {
                    return (
                      <li key={index}>
                        <a
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:text-sky-300 hover:underline"
                          title={source.title || source.uri}
                        >
                          {source.title || source.uri}
                        </a>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </section>
      </main>
      <footer className="text-center mt-12 py-6 border-t border-[#2D3748]">
        <p className="text-sm text-[#A0AEC0]">
          Developer documentation assistant &copy; {new Date().getFullYear()}. LLM integration by AI.
        </p>
      </footer>

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        // LLM & API Props
        selectedLlmProvider={selectedLlmProvider}
        onLlmProviderChange={(e) => setSelectedLlmProvider(e.target.value as LlmProvider)}
        apiKey={apiKey}
        onApiKeyChange={(e) => setApiKey(e.target.value)}
        azureOpenaiEndpoint={azureOpenaiEndpoint}
        onAzureOpenaiEndpointChange={(e) => setAzureOpenaiEndpoint(e.target.value)}
        azureOpenaiDeploymentName={azureOpenaiDeploymentName}
        onAzureOpenaiDeploymentNameChange={(e) => setAzureOpenaiDeploymentName(e.target.value)}
        openaiModelName={openaiModelName}
        onOpenaiModelNameChange={(e) => setOpenaiModelName(e.target.value)}
        useGrounding={useGrounding}
        onUseGroundingChange={(e) => setUseGrounding(e.target.checked)}
        llmProviderOptions={llmProviderOptions}
        // Guides & Templates Props
        markdownStyleGuide={markdownStyleGuide}
        onMarkdownStyleGuideChange={(e) => setMarkdownStyleGuide(e.target.value)}
        generalWritingStyleGuide={generalWritingStyleGuide}
        onGeneralWritingStyleGuideChange={(e) => setGeneralWritingStyleGuide(e.target.value)}
        documentCustomSettings={documentCustomSettings}
        onDocumentTypeSettingChange={handleDocumentTypeSettingChange}
        documentTypes={DOCUMENT_TYPES}
        currentAppDocTypeId={selectedDocumentTypeId}
      />
    </div>
  );
};

export default App;
