import React, { useState } from 'react';

interface ApiKeyInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  helpText?: string;
}

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228" />
  </svg>
);


const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your API key (optional)',
  className = '',
  helpText
}) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-3 pr-12 bg-[#243B53] border border-[#4A5568] rounded-md shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-[#E2E8F0] placeholder:text-[#A0AEC0]"
        />
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-[#A0AEC0] hover:text-[#E2E8F0]"
          aria-label={showKey ? 'Hide API key' : 'Show API key'}
        >
          {showKey ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      {helpText && <p className="mt-1 text-xs text-[#A0AEC0]">{helpText}</p>}
    </div>
  );
};

export default ApiKeyInput;