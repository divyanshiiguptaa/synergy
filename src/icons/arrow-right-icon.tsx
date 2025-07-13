import React from 'react';

export interface ArrowRightIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

function ArrowRightIcon({ className = '', ...props }: ArrowRightIconProps) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default ArrowRightIcon; 