import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { validateEmail, getEmailValidationError } from '../utils/validation';

interface EmailInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  id?: string;
  name?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  placeholder = "your.email@example.com",
  required = false,
  disabled = false,
  className = "",
  label,
  id,
  name = "email"
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (value) {
      const valid = validateEmail(value);
      const error = getEmailValidationError(value);
      setIsValid(valid);
      setErrorMessage(error);
      onChange(value, valid);
    } else {
      setIsValid(false);
      setErrorMessage('');
      onChange(value, false);
    }
  }, [value, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, validateEmail(newValue));
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  const showError = isTouched && value && !isValid;
  const showSuccess = value && isValid;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neon-magenta mb-2">
          {label} {required && '*'}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Mail className="h-5 w-5 text-cyan-400" />
        </div>
        
        <input
          type="email"
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full pl-12 pr-12 py-3 
            bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 
            focus:ring-2 focus:ring-neon-cyan/20 transition-all
            ${showError 
              ? 'border-red-500 focus:border-red-500' 
              : showSuccess 
                ? 'border-green-500 focus:border-green-500' 
                : 'border-neon-cyan/30 focus:border-neon-cyan'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {/* Validation icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {showSuccess && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {showError && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Error message */}
      {showError && (
        <div className="mt-2 text-sm text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          {errorMessage}
        </div>
      )}
      
      {/* Success message */}
      {showSuccess && (
        <div className="mt-2 text-sm text-green-400 flex items-center">
          <CheckCircle className="h-4 w-4 mr-1 flex-shrink-0" />
          Valid email address
        </div>
      )}
    </div>
  );
};

export default EmailInput;
