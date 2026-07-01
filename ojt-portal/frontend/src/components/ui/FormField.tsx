import React from 'react';
import { type LucideIcon, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required = false, children, className = '' }: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className={`block text-sm font-medium transition-colors ${error ? 'text-red-600' : 'text-gray-700'}`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-600 font-medium mt-1 animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function ValidatedInput({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  required = false,
  className = '',
  ...props
}: ValidatedInputProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <div className="relative group">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon className={`h-4 w-4 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg shadow-sm border transition-all duration-200
            py-1.5 text-sm outline-none
            ${error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400'
            }
            ${Icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'}
            ${(Icon && iconPosition === 'right') || error ? 'pr-10' : 'pr-3'}
            bg-white
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          {...props}
        />

        {Icon && iconPosition === 'right' && !error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
            <Icon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
          </div>
        )}

        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none animate-in fade-in zoom-in duration-300">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
    </FormField>
  );
}

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function ValidatedTextarea({
  label,
  error,
  required = false,
  className = '',
  ...props
}: ValidatedTextareaProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <textarea
        className={`
          block w-full rounded-lg shadow-sm border transition-all duration-200
          p-3 text-sm outline-none
          ${error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400'
          }
          bg-white
          ${className}
        `}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
    </FormField>
  );
}

interface ValidatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function ValidatedSelect({
  label,
  error,
  options,
  required = false,
  className = '',
  ...props
}: ValidatedSelectProps) {
  return (
    <FormField label={label} error={error} required={required}>
      <div className="relative">
        <select
          className={`
            block w-full rounded-lg shadow-sm border transition-all duration-200
            py-1.5 pl-3 pr-8 text-sm outline-none appearance-none
            ${error
              ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400'
            }
            bg-white
            ${className}
          `}
          aria-invalid={error ? "true" : "false"}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
        {/* Custom Arrow could go here, but focusing on error state for now */}
      </div>
    </FormField>
  );
}