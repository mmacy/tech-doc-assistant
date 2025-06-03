
import { DocumentType } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const OPENAI_MODEL_NAME = 'gpt-4o-mini'; // Standard OpenAI model
export const AZURE_OPENAI_DEFAULT_DEPLOYMENT_NAME = 'your-gpt-4o-mini-deployment'; // Placeholder for Azure deployment

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'how-to',
    name: 'How-to',
    templatePath: 'templates/how-to-guide.md',
    descriptionPath: 'descriptions/how-to-guide.md',
  },
  {
    id: 'concept',
    name: 'Concept',
    templatePath: 'templates/concept-overview.md',
    descriptionPath: 'descriptions/concept-overview.md',
  },
];

export const MARKDOWN_STYLE_GUIDE_CONTENT = `
# Markdown Styling Rules

## General
- Use ATX-style headers (e.g., \`# Header 1\`, \`## Header 2\`).
- Use hyphens (\`-\`) for unordered lists.
- Use numbered lists for sequential items (e.g., \`1. First item\`).
- Emphasize text with asterisks for italics (\`*italic*\`) or bold (\`**bold**\`).
- Use backticks for inline code: \`inline code\`.
- Use triple backticks for code blocks, specifying the language:
  \`\`\`javascript
  console.log('Hello');
  \`\`\`
- Links should be formatted as \`[Link text](URL)\`.
- Images should be formatted as \`![Alt text](URL)\`.

## Specifics
- Maximum line length: 100 characters (where applicable, for readability).
- Ensure lists have a blank line before and after, unless they are nested.
- Code blocks should be concise and relevant.
- Avoid trailing whitespace.
- Use consistent heading levels.
`;

export const GENERAL_WRITING_STYLE_GUIDE_CONTENT = `
# General Writing Style Guide

## Tone and Voice
- **Target Audience**: Software Developers.
- **Tone**: Professional, clear, concise, and helpful.
- **Voice**: Active voice is preferred over passive voice.
- **Terminology**: Use industry-standard terminology consistently. Define acronyms on first use.

## Content
- **Clarity**: Explain complex concepts simply. Avoid jargon where possible, or explain it if necessary.
- **Accuracy**: Ensure all technical information is correct and up-to-date.
- **Completeness**: Provide all necessary information for the user to achieve their goal.
- **Examples**: Use practical, runnable code examples where appropriate.

## Formatting
- Break down long topics into smaller, digestible sections.
- Use bullet points and numbered lists to improve readability.
- Ensure a logical flow of information.
`;

export const DOCUMENT_TEMPLATES: Record<string, string> = {
  'how-to': `
# How-to: {{TITLE}}

## Introduction
Briefly describe what this guide will help the user accomplish.

## Prerequisites
- List any necessary software, tools, or prior knowledge.

## Steps

1.  **Step 1**: Detailed explanation.
    \`\`\`
    // Optional code example for step 1
    \`\`\`
2.  **Step 2**: Detailed explanation.
    \`\`\`
    // Optional code example for step 2
    \`\`\`
...

## Conclusion
Summarize what was achieved.

## Next Steps
Suggest related guides or further reading.
`,
  'concept': `
# Concept: {{CONCEPT_NAME}}

## Overview
Provide a high-level summary of the concept. What is it? Why is it important?

## Key Ideas
- **Idea 1**: Explanation.
- **Idea 2**: Explanation.
  - Sub-idea: Details.

## How it Works
Explain the mechanics or architecture of the concept. Diagrams or pseudo-code might be useful here (describe them in text for the LLM to potentially format as Markdown).

## Benefits
- Benefit 1
- Benefit 2

## Use Cases
- When to use this concept.
- Examples of scenarios where it's applicable.

## Related Concepts
- Link to other relevant concepts or documentation.
`,
};

export const DOCUMENT_DESCRIPTIONS: Record<string, string> = {
  'how-to': "A step-by-step guide that helps developers complete a specific task. Focus on clear instructions and actionable steps.",
  'concept': "An explanation of a key concept, technology, or architecture. Aim for clarity and understanding of its purpose and mechanics.",
};

export const DEFAULT_OPENAI_API_KEY_PLACEHOLDER = "OPENAI_API_KEY_NOT_CONFIGURED (uses process.env.OPENAI_API_KEY if available)";
export const DEFAULT_AZURE_OPENAI_API_KEY_PLACEHOLDER = "AZURE_OPENAI_API_KEY_NOT_CONFIGURED (uses process.env.AZURE_OPENAI_API_KEY if available)";
export const DEFAULT_AZURE_OPENAI_ENDPOINT_PLACEHOLDER = "AZURE_OPENAI_ENDPOINT_NOT_CONFIGURED (uses process.env.AZURE_OPENAI_ENDPOINT if available)";
export const DEFAULT_AZURE_OPENAI_DEPLOYMENT_NAME_PLACEHOLDER = "AZURE_DEPLOYMENT_NAME_NOT_CONFIGURED (uses process.env.AZURE_OPENAI_DEPLOYMENT_NAME or default)";
export const DEFAULT_OPENAI_MODEL_NAME_PLACEHOLDER = `OPENAI_MODEL_NAME_NOT_CONFIGURED (uses '${OPENAI_MODEL_NAME}' or process.env.OPENAI_MODEL_NAME if available)`;
