import { useState } from 'react';
import type { ReactNode } from 'react';
import ArrowRightIcon from '../icons/arrow-right-icon';

export interface CollapsibleProps {
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ header, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <button
        className="flex items-center w-full focus:outline-none"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {header}
        <ArrowRightIcon className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default Collapsible; 