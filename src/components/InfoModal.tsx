import Button from './Button';
import { X, MapPin, Filter, Layers, Info, Download } from 'lucide-react';

export interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

function InfoModal({ 
  isOpen, 
  onClose, 
  title = "How to Use This Map"
}: InfoModalProps) {
  if (!isOpen) return null;

  const helpItems = [
    {
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      title: "Map Navigation",
      description: "Pan and zoom to explore city projects and infrastructure. Click on any project area to view details."
    },
    {
      icon: <Filter className="w-5 h-5 text-green-600" />,
      title: "Filters",
      description: "Use the Filters button (top right) to filter projects by department, date range, or cost."
    },
    {
      icon: <Layers className="w-5 h-5 text-purple-600" />,
      title: "Layers",
      description: "Toggle map layers using the Layers panel (top left) to show/hide different data types."
    },
    {
      icon: <Info className="w-5 h-5 text-yellow-600" />,
      title: "Project Details",
      description: "Click on any project area to see detailed information including affected infrastructure."
    },
    {
      icon: <Download className="w-5 h-5 text-gray-600" />,
      title: "Data Export",
      description: "Export matched data and analysis results for further analysis."
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {helpItems.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Got it!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoModal; 