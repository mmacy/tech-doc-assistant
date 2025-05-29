
import { 
  MARKDOWN_STYLE_GUIDE_CONTENT, 
  GENERAL_WRITING_STYLE_GUIDE_CONTENT,
  DOCUMENT_TEMPLATES,
  DOCUMENT_DESCRIPTIONS
} from '../constants';

export const getMarkdownStyleGuide = (): string => {
  return MARKDOWN_STYLE_GUIDE_CONTENT;
};

export const getGeneralWritingStyleGuide = (): string => {
  return GENERAL_WRITING_STYLE_GUIDE_CONTENT;
};

export const getDocumentTemplate = (documentTypeId: string): string | null => {
  return DOCUMENT_TEMPLATES[documentTypeId] || null;
};

export const getDocumentDescription = (documentTypeId: string): string | null => {
  return DOCUMENT_DESCRIPTIONS[documentTypeId] || null;
};
