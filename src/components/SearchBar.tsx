import type { ChangeEvent } from 'react';
import SearchIcon from '../icons/search-icon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 w-48 focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
      <span className="mr-2 text-neutral-500">
        <SearchIcon className="w-4 h-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder || 'Search...'}
        className="searchbar-input bg-transparent outline-none text-sm w-full placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        aria-label={placeholder || 'Search'}
      />
    </div>
  );
} 