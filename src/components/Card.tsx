import React from 'react';

export interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  maxWidth?: string;
  minWidth?: string;
}

function Card({ 
  title, 
  children, 
  className = '', 
  position = 'bottom-right',
  variant = 'default',
  size = 'md',
  maxWidth,
  minWidth
}: CardProps) {
  const positionClasses = {
    'top-left': 'fixed top-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  const variantClasses = {
    default: 'bg-white shadow-lg border border-gray-200',
    elevated: 'bg-white shadow-2xl border-0',
    outlined: 'bg-white shadow-sm border-2 border-gray-300'
  };

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const widthStyles = {
    ...(maxWidth && { maxWidth }),
    ...(minWidth && { minWidth })
  };

  return (
    <div 
      className={`${positionClasses[position]} ${variantClasses[variant]} rounded-lg z-50 ${sizeClasses[size]} ${className}`}
      style={widthStyles}
    >
      {title && (
        <div className="flex items-center space-x-2 mb-2">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card; 