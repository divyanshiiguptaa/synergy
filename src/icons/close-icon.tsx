import React from 'react';

export interface CloseIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

function CloseIcon({ className = '', ...props }: CloseIconProps) {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default CloseIcon; 