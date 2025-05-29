import React from 'react';

interface TextAreaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  required?: boolean;
  disabled?: boolean; // Added disabled prop
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  rows = 5,
  className = '',
  required = false,
  disabled = false, // Default to false
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled} // Apply disabled prop
        className={`w-full p-3 bg-[#243B53] border border-[#4A5568] rounded-md shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-[#E2E8F0] placeholder:text-[#A0AEC0] resize-y ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      />
    </div>
  );
};

export default TextAreaInput;