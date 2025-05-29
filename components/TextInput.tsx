import React from 'react';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  required = false,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 bg-[#243B53] border border-[#4A5568] rounded-md shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-[#E2E8F0] placeholder:text-[#A0AEC0]"
      />
    </div>
  );
};

export default TextInput;