import React from 'react';
import Button from './Button';

interface MarkdownDisplayProps {
  markdownContent: string;
  fileName?: string;
}

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

const ArrowDownTrayIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);


const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ markdownContent, fileName = 'documentation.md' }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again or copy manually.');
    });
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (!markdownContent) {
    return null;
  }

  return (
    // The parent section in App.tsx now has bg-[#152B43], so this div doesn't need a separate background unless different.
    // If this needs to be distinct from the section's bg, we can add it. For now, assume it inherits or is transparent.
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-sky-400">Markdown document</h3>
        <div className="flex space-x-3">
          <Button
            onClick={handleCopyToClipboard}
            variant="secondary"
            icon={<ClipboardIcon />}
            className="text-sm px-4 py-2"
            disabled={!markdownContent}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            onClick={handleDownload}
            variant="secondary"
            icon={<ArrowDownTrayIcon />}
            className="text-sm px-4 py-2"
            disabled={!markdownContent}
          >
            Download .md
          </Button>
        </div>
      </div>
      <pre className="whitespace-pre-wrap break-words bg-[#0A1D31] p-4 rounded-md text-sm text-[#E2E8F0] overflow-x-auto shadow-inner">
        {markdownContent}
      </pre>
    </div>
  );
};

export default MarkdownDisplay;