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

const POSITION_CLASSES = {
  'top-left': 'fixed top-4 left-4',
  'top-right': 'fixed top-4 right-4',
  'bottom-left': 'fixed bottom-4 left-4',
  'bottom-right': 'fixed bottom-4 right-4',
  'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

const VARIANT_CLASSES = {
  default: 'bg-white shadow-lg border border-gray-200',
  elevated: 'bg-white shadow-2xl border-0',
  outlined: 'bg-white shadow-sm border-2 border-gray-300',
};

const SIZE_CLASSES = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center space-x-2 mb-2">{children}</div>;
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
  const widthStyles = {
    ...(maxWidth && { maxWidth }),
    ...(minWidth && { minWidth })
  };

  return (
    <div 
      className={`${POSITION_CLASSES[position]} ${VARIANT_CLASSES[variant]} rounded-lg z-50 ${SIZE_CLASSES[size]} ${className}`}
      style={widthStyles}
    >
      {title && <CardHeader>{title}</CardHeader>}
      {children}
    </div>
  );
}

export default Card; 