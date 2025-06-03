
import React, { useState, useEffect } from 'react';
import { LlmProvider, DocumentType, AllDocumentTypeSettings, DocumentTypeSetting } from '../types';
import {
  DEFAULT_OPENAI_API_KEY_PLACEHOLDER,
  DEFAULT_AZURE_OPENAI_API_KEY_PLACEHOLDER,
  DEFAULT_AZURE_OPENAI_ENDPOINT_PLACEHOLDER,
  DEFAULT_AZURE_OPENAI_DEPLOYMENT_NAME_PLACEHOLDER,
  DEFAULT_OPENAI_MODEL_NAME_PLACEHOLDER
} from '../constants';
import SelectInput from './SelectInput';
import ApiKeyInput from './ApiKeyInput';
import Button from './Button';
import TextAreaInput from './TextAreaInput';
import TextInput from './TextInput';

interface Option {
  value: string;
  label: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  // LLM & API Props
  selectedLlmProvider: LlmProvider;
  onLlmProviderChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  apiKey: string;
  onApiKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  azureOpenaiEndpoint: string;
  onAzureOpenaiEndpointChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  azureOpenaiDeploymentName: string;
  onAzureOpenaiDeploymentNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  openaiModelName: string;
  onOpenaiModelNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  useGrounding: boolean;
  onUseGroundingChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  llmProviderOptions: Option[];
  // Guides & Templates Props
  markdownStyleGuide: string;
  onMarkdownStyleGuideChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  generalWritingStyleGuide: string;
  onGeneralWritingStyleGuideChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  documentCustomSettings: AllDocumentTypeSettings;
  onDocumentTypeSettingChange: (docTypeId: string, field: keyof DocumentTypeSetting, value: string) => void;
  documentTypes: DocumentType[];
  currentAppDocTypeId: string;
}

type ActiveTab = 'api' | 'guides';

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedLlmProvider,
  onLlmProviderChange,
  apiKey,
  onApiKeyChange,
  azureOpenaiEndpoint,
  onAzureOpenaiEndpointChange,
  azureOpenaiDeploymentName,
  onAzureOpenaiDeploymentNameChange,
  openaiModelName,
  onOpenaiModelNameChange,
  useGrounding,
  onUseGroundingChange,
  llmProviderOptions,
  markdownStyleGuide,
  onMarkdownStyleGuideChange,
  generalWritingStyleGuide,
  onGeneralWritingStyleGuideChange,
  documentCustomSettings,
  onDocumentTypeSettingChange,
  documentTypes,
  currentAppDocTypeId,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('guides');
  const [selectedDocTypeForEditingGuides, setSelectedDocTypeForEditingGuides] = useState<string>(currentAppDocTypeId);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('guides');
      if (documentTypes.find(dt => dt.id === currentAppDocTypeId)) {
        setSelectedDocTypeForEditingGuides(currentAppDocTypeId);
      } else if (documentTypes.length > 0) {
        setSelectedDocTypeForEditingGuides(documentTypes[0].id);
      } else {
        setSelectedDocTypeForEditingGuides('');
      }
    }
  }, [isOpen, currentAppDocTypeId, documentTypes]);


  if (!isOpen) {
    return null;
  }

  const documentTypeOptionsForModal = documentTypes.map(docType => ({ value: docType.id, label: docType.name }));
  const currentEditingSettings = documentCustomSettings[selectedDocTypeForEditingGuides] || { template: '', description: '' };
  const selectedDocTypeNameForLabel = documentTypes.find(dt => dt.id === selectedDocTypeForEditingGuides)?.name || "Selected";

  const tabBaseStyles = "px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none transition-colors";
  const activeTabStyles = "bg-[#243B53] text-sky-400 border-b-2 border-sky-400";
  const inactiveTabStyles = "text-[#A0AEC0] hover:text-[#E2E8F0] hover:bg-[#2D3748]/50";

  let apiKeyLabel = "API key (optional)";
  let apiKeyPlaceholder = "Uses system default if empty (if configured)";
  let apiKeyHelpText = "If you provide a key, it will be used. Otherwise, a system-configured key (if available) will be used.";

  if (selectedLlmProvider === LlmProvider.GEMINI) {
    apiKeyLabel = "Google Gemini API key (optional)";
    apiKeyPlaceholder = "Uses process.env.API_KEY if empty";
    apiKeyHelpText = "If provided, this key is used. Otherwise, relies on a system-level API_KEY environment variable.";
  } else if (selectedLlmProvider === LlmProvider.AZURE_OPENAI) {
    apiKeyLabel = "Azure OpenAI API key";
    apiKeyPlaceholder = DEFAULT_AZURE_OPENAI_API_KEY_PLACEHOLDER;
    apiKeyHelpText = "Required for Azure OpenAI. Provide your Azure OpenAI service key.";
  } else if (selectedLlmProvider === LlmProvider.OPENAI) {
    apiKeyLabel = "OpenAI API key (optional)";
    apiKeyPlaceholder = DEFAULT_OPENAI_API_KEY_PLACEHOLDER;
    apiKeyHelpText = "If provided, this key is used. Otherwise, relies on a system-level OPENAI_API_KEY environment variable.";
  }

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>, setter: (content: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setter(text);
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };


  return (
    <div
      className="fixed inset-0 bg-[#0A1D31]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[#152B43] p-0 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 4rem)'}}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-sky-400">Settings</h3>
              <button
                onClick={onClose}
                className="text-[#A0AEC0] hover:text-[#E2E8F0]"
                aria-label="Close settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border-b border-[#2D3748] mb-1">
              <nav className="-mb-px flex space-x-2" aria-label="Tabs">
              <button
                  onClick={() => setActiveTab('guides')}
                  className={`${tabBaseStyles} ${activeTab === 'guides' ? activeTabStyles : inactiveTabStyles}`}
                  aria-current={activeTab === 'guides' ? 'page' : undefined}
                >
                  Style guides
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`${tabBaseStyles} ${activeTab === 'api' ? activeTabStyles : inactiveTabStyles}`}
                  aria-current={activeTab === 'api' ? 'page' : undefined}
                >
                  LLM configuration
                </button>
              </nav>
            </div>
        </div>

        <div className="overflow-y-auto px-6 pb-6 flex-grow">
            {activeTab === 'api' && (
              <div className="space-y-6 pt-4">
                <SelectInput
                  id="llmProviderModal"
                  label="LLM provider"
                  value={selectedLlmProvider}
                  onChange={onLlmProviderChange}
                  options={llmProviderOptions}
                />
                <ApiKeyInput
                  id="apiKeyModal"
                  label={apiKeyLabel}
                  value={apiKey}
                  onChange={onApiKeyChange}
                  placeholder={apiKeyPlaceholder}
                  helpText={apiKeyHelpText}
                />
                {selectedLlmProvider === LlmProvider.AZURE_OPENAI && (
                  <>
                    <TextInput
                      id="azureOpenaiEndpointModal"
                      label="Azure OpenAI endpoint"
                      value={azureOpenaiEndpoint}
                      onChange={onAzureOpenaiEndpointChange}
                      placeholder={DEFAULT_AZURE_OPENAI_ENDPOINT_PLACEHOLDER}
                    />
                    <TextInput
                      id="azureOpenaiDeploymentNameModal"
                      label="Azure OpenAI deployment name"
                      value={azureOpenaiDeploymentName}
                      onChange={onAzureOpenaiDeploymentNameChange}
                      placeholder={DEFAULT_AZURE_OPENAI_DEPLOYMENT_NAME_PLACEHOLDER}
                    />
                  </>
                )}
                 {selectedLlmProvider === LlmProvider.OPENAI && (
                  <TextInput
                    id="openaiModelNameModal"
                    label="OpenAI model name (optional)"
                    value={openaiModelName}
                    onChange={onOpenaiModelNameChange}
                    placeholder={DEFAULT_OPENAI_MODEL_NAME_PLACEHOLDER}
                  />
                )}
                {selectedLlmProvider === LlmProvider.GEMINI && (
                  <div className="p-4 bg-[#243B53] rounded-md border border-[#2D3748]">
                    <label htmlFor="useGroundingModal" className="flex items-center space-x-3 text-sm font-medium text-[#E2E8F0] cursor-pointer">
                      <input
                        type="checkbox"
                        id="useGroundingModal"
                        checked={useGrounding}
                        onChange={onUseGroundingChange}
                        className="h-5 w-5 rounded border-[#4A5568] bg-[#2D3748] text-sky-500 focus:ring-sky-400 focus:ring-offset-1 focus:ring-offset-[#243B53]"
                      />
                      <span className="text-base">Use Google Search grounding</span>
                    </label>
                    <p className="text-xs text-[#A0AEC0] mt-2 ml-1">
                      Enhances responses for recent events or up-to-date info. May increase generation time. Only for Google Gemini.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="space-y-2 pt-4">
                <h4 className="text-lg font-medium text-sky-300 border-b border-[#2D3748] pb-2 mb-3">Global style</h4>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="generalWritingStyleGuideModal" className="block text-sm font-medium text-[#E2E8F0]">Writing style guide</label>
                    <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => document.getElementById('generalStyleFile')?.click()}>Load from file</Button>
                    <input type="file" id="generalStyleFile" className="hidden" accept=".md,.txt" onChange={(e) => handleFileLoad(e, (content) => onGeneralWritingStyleGuideChange({ target: { value: content } } as React.ChangeEvent<HTMLTextAreaElement>))} />
                  </div>
                  <TextAreaInput
                    id="generalWritingStyleGuideModal"
                    label=""
                    value={generalWritingStyleGuide}
                    onChange={onGeneralWritingStyleGuideChange}
                    rows={4}
                    className="text-sm mt-0 mb-0"
                  />
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="markdownStyleGuideModal" className="block text-sm font-medium text-[#E2E8F0]">Markdown style guide</label>
                    <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => document.getElementById('markdownStyleFile')?.click()}>Load from file</Button>
                    <input type="file" id="markdownStyleFile" className="hidden" accept=".md,.txt" onChange={(e) => handleFileLoad(e, (content) => onMarkdownStyleGuideChange({ target: { value: content } } as React.ChangeEvent<HTMLTextAreaElement>))} />
                  </div>
                  <TextAreaInput
                    id="markdownStyleGuideModal"
                    label=""
                    value={markdownStyleGuide}
                    onChange={onMarkdownStyleGuideChange}
                    rows={4}
                    className="text-sm mt-0 mb-0"
                  />
                </div>

                <h4 className="text-lg font-medium text-sky-300 border-b border-[#2D3748] pb-2 my-3 pt-2">Doc styles</h4>
                {documentTypes.length > 0 ? (
                  <>
                    <SelectInput
                      id="docTypeForGuidesModal"
                      label="Select a doc type:"
                      value={selectedDocTypeForEditingGuides}
                      onChange={(e) => setSelectedDocTypeForEditingGuides(e.target.value)}
                      options={documentTypeOptionsForModal}
                      className="mb-3"
                    />
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="docTypeTemplateModal" className="block text-sm font-medium text-[#E2E8F0]">{`Template: ${selectedDocTypeNameForLabel}`}</label>
                        <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => document.getElementById('docTemplateFile')?.click()} disabled={!selectedDocTypeForEditingGuides}>Load from file</Button>
                        <input type="file" id="docTemplateFile" className="hidden" accept=".md,.txt" onChange={(e) => handleFileLoad(e, (content) => onDocumentTypeSettingChange(selectedDocTypeForEditingGuides, 'template', content))} />
                      </div>
                      <TextAreaInput
                        id="docTypeTemplateModal"
                        label=""
                        value={currentEditingSettings.template}
                        onChange={(e) => onDocumentTypeSettingChange(selectedDocTypeForEditingGuides, 'template', e.target.value)}
                        rows={4}
                        className="text-sm mt-0 mb-0"
                        disabled={!selectedDocTypeForEditingGuides}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="docTypeDescriptionModal" className="block text-sm font-medium text-[#E2E8F0]">{`Description: ${selectedDocTypeNameForLabel}`}</label>
                        <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => document.getElementById('docDescFile')?.click()} disabled={!selectedDocTypeForEditingGuides}>Load from file</Button>
                        <input type="file" id="docDescFile" className="hidden" accept=".md,.txt" onChange={(e) => handleFileLoad(e, (content) => onDocumentTypeSettingChange(selectedDocTypeForEditingGuides, 'description', content))} />
                      </div>
                      <TextAreaInput
                        id="docTypeDescriptionModal"
                        label=""
                        value={currentEditingSettings.description}
                        onChange={(e) => onDocumentTypeSettingChange(selectedDocTypeForEditingGuides, 'description', e.target.value)}
                        rows={4}
                        className="text-sm mt-0 mb-0"
                        disabled={!selectedDocTypeForEditingGuides}
                      />
                    </div>
                  </>
                ) : (
                   <p className="text-sm text-[#A0AEC0]">No document types to customize.</p>
                )}
              </div>
            )}
        </div>

        <div className="px-6 py-4 border-t border-[#2D3748] mt-auto">
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full text-lg"
            >
              Done
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;