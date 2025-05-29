import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  icon,
  ...props
}) => {
  const baseStyles = "px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center transition-colors duration-150";
  
  // Updated color palette
  const focusRingOffsetColor = 'focus:ring-offset-[#152B43]'; // Based on card background where buttons are typically placed

  const variantStyles = {
    primary: `bg-sky-500 hover:bg-sky-600 focus:ring-sky-500 text-white ${focusRingOffsetColor}`,
    secondary: `bg-[#2D3748] hover:bg-[#4A5568] focus:ring-sky-500 text-[#E2E8F0] ${focusRingOffsetColor}`,
    danger: `bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white ${focusRingOffsetColor}`,
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${isLoading ? disabledStyles : ''} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon && <span className="mr-2 -ml-1 h-5 w-5">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;