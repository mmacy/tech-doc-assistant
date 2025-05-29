import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-[#E2E8F0] mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-[#243B53] border border-[#4A5568] rounded-md shadow-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-[#E2E8F0] placeholder:text-[#A0AEC0]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} style={{ backgroundColor: '#243B53', color: '#E2E8F0' }}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;