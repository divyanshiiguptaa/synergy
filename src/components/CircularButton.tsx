import { useState } from 'react';
import type { ReactNode, ElementType, MouseEventHandler } from 'react';
import CloseIcon from '../icons/close-icon';

export interface CircularButtonProps {
  icon: ElementType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  ariaLabel?: string;
  title?: string;
  children?: ReactNode;
  popupContent?: ReactNode;
  popupTitle?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

function CircularButton({
  icon: Icon,
  onClick,
  className = '',
  ariaLabel,
  title,
  children,
  popupContent,
  popupTitle,
  size = 'md',
  variant = 'primary',
  disabled = false,
}: CircularButtonProps) {
  const [open, setOpen] = useState(false);

  // Generate default labels from icon name if not provided
  const defaultLabel = ariaLabel || title || 'Button';
  const defaultTitle = title || ariaLabel || 'Button';

  // Size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-white border shadow hover:bg-blue-50',
    secondary: 'bg-gray-100 border border-gray-300 hover:bg-gray-200',
    ghost: 'bg-transparent border border-transparent hover:bg-gray-100'
  };

  const iconColorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    ghost: 'text-gray-500'
  };

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);
    if (popupContent) setOpen(true);
  };

  return (
    <>
      <button
        className={`${sizeClasses[size]} rounded-full ${variantClasses[variant]} flex items-center justify-center transition ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        aria-label={defaultLabel}
        title={defaultTitle}
        onClick={handleButtonClick}
        disabled={disabled}
        type="button"
      >
        <Icon className={`${iconSizeClasses[size]} ${iconColorClasses[variant]}`} />
        {children}
      </button>
      {popupContent && open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            {popupTitle && (
              <h2 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Icon className="w-6 h-6 text-blue-600" /> {popupTitle}
              </h2>
            )}
            {popupContent}
          </div>
        </div>
      )}
    </>
  );
}

export default CircularButton; 