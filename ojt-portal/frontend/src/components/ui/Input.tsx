import React, { forwardRef } from "react";
import { type LucideIcon, AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  gradient?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon: Icon,
      iconPosition = "left",
      gradient = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1.5 group">
        {label && (
          <label className={`block text-sm font-medium transition-colors ${error ? 'text-red-600' : 'text-gray-700'}`}>
            {label}
          </label>
        )}
        <div className="relative">
          {/* Left Icon */}
          {Icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className={`h-4 w-4 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
            </div>
          )}

          <input
            ref={ref}
            className={`
              block w-full rounded-lg shadow-sm border transition-all duration-200
              py-2.5 text-sm outline-none
              ${gradient ? "bg-gray-50" : "bg-white"}
              ${Icon && iconPosition === "left" ? "pl-10" : "pl-3"}
              ${(Icon && iconPosition === "right") || error ? "pr-10" : "pr-3"}
              ${error
                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 hover:border-gray-400"
              }
              ${className}
            `}
            aria-invalid={error ? "true" : "false"}
            {...props}
          />

          {/* Right Icon (User provided) - Hidden if there is an error to show AlertCircle instead, or we can stack if carefully managed. Standard is to replace. */}
          {Icon && iconPosition === "right" && !error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
            </div>
          )}

          {/* Error Icon */}
          {error && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none animate-in fade-in zoom-in duration-300">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium mt-1 animate-in slide-in-from-top-1 duration-200 flex items-center">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;