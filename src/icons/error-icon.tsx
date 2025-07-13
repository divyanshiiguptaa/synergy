import React from 'react';

export interface ErrorIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

function ErrorIcon({ className = '', ...props }: ErrorIconProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );
}

export default ErrorIcon; 