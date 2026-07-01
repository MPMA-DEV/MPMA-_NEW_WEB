
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  glass?: boolean;
  color?: 'default' | 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'indigo' | 'yellow';
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  glass = false,
  color = 'default'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6'
  };

  const colorClasses = {
    default: 'bg-white border border-gray-200',
    blue: 'card-blue',
    purple: 'card-purple',
    green: 'card-green',
    orange: 'card-orange',
    pink: 'bg-pink-50 border-pink-100',
    cyan: 'card-cyan',
    indigo: 'card-indigo',
    yellow: 'card-yellow'
  };

  const baseClasses = `
    relative overflow-hidden rounded-xl
    ${glass ? 'glass-panel' : colorClasses[color]}
    ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer' : 'shadow-sm'}
    ${paddingClasses[padding]}
    ${className}
  `;

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-3 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CardTitle({ children, className = '', size = 'md' }: CardTitleProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };

  return (
    <h3 className={`
      ${sizeClasses[size]} font-semibold text-gray-900 tracking-tight
      ${className}
    `}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
