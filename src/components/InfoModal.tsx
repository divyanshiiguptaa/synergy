import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { X, MapPin, Filter, Layers, Info, Download } from 'lucide-react';
import Button from './Button';

export interface InfoModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Custom help items to display */
  helpItems?: HelpItem[];
}

export interface HelpItem {
  /** Icon component to display */
  icon: LucideIcon;
  /** Item title */
  title: string;
  /** Item description */
  description: string;
  /** Icon color variant */
  iconColor?: 'blue' | 'green' | 'purple' | 'yellow' | 'gray';
}

const DEFAULT_HELP_ITEMS: HelpItem[] = [
  {
    icon: MapPin,
    title: "Map Navigation",
    description: "Pan and zoom to explore city projects and infrastructure. Click on any project area to view details.",
    iconColor: "blue"
  },
  {
    icon: Filter,
    title: "Filters",
    description: "Use the Filters button (top right) to filter projects by department, date range, or cost.",
    iconColor: "green"
  },
  {
    icon: Layers,
    title: "Layers",
    description: "Toggle map layers using the Layers panel (top left) to show/hide different data types.",
    iconColor: "purple"
  },
  {
    icon: Info,
    title: "Project Details",
    description: "Click on any project area to see detailed information including affected infrastructure.",
    iconColor: "yellow"
  },
  {
    icon: Download,
    title: "Data Export",
    description: "Export matched data and analysis results for further analysis.",
    iconColor: "gray"
  }
];

const ICON_COLOR_CLASSES = {
  blue: "text-blue-600",
  green: "text-green-600", 
  purple: "text-purple-600",
  yellow: "text-yellow-600",
  gray: "text-gray-600"
} as const;

interface ModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, onClose }) => (
  <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
  >
    {children}
  </div>
);

interface ModalContentProps {
  children: React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ children }) => (
  <div 
    className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Close modal"
      type="button"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

interface ModalBodyProps {
  children: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => (
  <div className="p-4 flex-1 overflow-y-auto">
    {children}
  </div>
);

interface ModalFooterProps {
  children: React.ReactNode;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => (
  <div className="p-4 border-t border-gray-200 flex-shrink-0">
    {children}
  </div>
);

interface HelpItemComponentProps {
  item: HelpItem;
}

const HelpItemComponent: React.FC<HelpItemComponentProps> = ({ item }) => {
  const IconComponent = item.icon;
  const iconColorClass = item.iconColor ? ICON_COLOR_CLASSES[item.iconColor] : ICON_COLOR_CLASSES.gray;
  
  return (
    <div className="flex items-start gap-3 group">
      <div className="flex-shrink-0 mt-0.5">
        <IconComponent className={`w-5 h-5 ${iconColorClass} group-hover:scale-110 transition-transform`} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

interface HelpItemsListProps {
  items: HelpItem[];
}

const HelpItemsList: React.FC<HelpItemsListProps> = ({ items }) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <HelpItemComponent key={`${item.title}-${index}`} item={item} />
    ))}
  </div>
);

const InfoModal: React.FC<InfoModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "How to Use This Map",
  helpItems = DEFAULT_HELP_ITEMS
}) => {
  // Early return for closed modal
  if (!isOpen) return null;

  const handleOverlayClick = () => onClose();

  return (
    <ModalOverlay onClose={handleOverlayClick}>
      <ModalContent>
        <ModalHeader title={title} onClose={onClose} />
        
        <ModalBody>
          <HelpItemsList items={helpItems} />
        </ModalBody>
        
        <ModalFooter>
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
              aria-label="Close modal and confirm understanding"
            >
              Got it!
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default InfoModal; 