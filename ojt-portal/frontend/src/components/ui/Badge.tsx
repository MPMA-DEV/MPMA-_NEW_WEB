import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  gradient?: boolean;
  pulse?: boolean;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  gradient = false,
  pulse = false 
}: BadgeProps) {
  const variants = {
    default: gradient 
      ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
      : 'bg-gray-100 text-gray-800 border border-gray-300',
    success: gradient
      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300'
      : 'bg-green-100 text-green-800 border border-green-300',
    warning: gradient
      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300'
      : 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    error: gradient
      ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-300'
      : 'bg-red-100 text-red-800 border border-red-300',
    info: gradient
      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-300'
      : 'bg-blue-100 text-blue-800 border border-blue-300',
    purple: gradient
      ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-300'
      : 'bg-purple-100 text-purple-800 border border-purple-300',
    pink: gradient
      ? 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border border-pink-300'
      : 'bg-pink-100 text-pink-800 border border-pink-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center font-semibold rounded-full shadow-sm
      ${variants[variant]} ${sizes[size]} 
      ${pulse ? 'animate-pulse' : ''}
      ${className}
    `}>
      {children}
    </span>
  );
}