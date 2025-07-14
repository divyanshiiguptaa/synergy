import { useState, type ReactNode } from 'react';
import ArrowRightIcon from '../icons/arrow-right-icon';
import Button from './Button';

export interface CollapsibleProps {
  header: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

interface ToggleButtonProps {
  open: boolean;
  onClick: () => void;
  children: ReactNode;
}

function ToggleButton({ open, onClick, children }: ToggleButtonProps) {
  return (
    <Button
      className="flex items-center w-full focus:outline-none"
      aria-expanded={open}
      onClick={onClick}
      type="button"
      variant="ghost"
      size="md"
    >
      {children}
      <ArrowRightIcon className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
    </Button>
  );
}

function Collapsible({ header, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="w-full">
      <ToggleButton open={open} onClick={() => setOpen((v) => !v)}>
        {header}
      </ToggleButton>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default Collapsible; 