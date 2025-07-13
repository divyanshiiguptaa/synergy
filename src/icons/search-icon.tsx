import React from 'react';

const SearchIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    aria-hidden="true"
    width={16}
    height={16}
  >
    <circle cx="11" cy="11" r="7" stroke="currentColor" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

export default SearchIcon; 