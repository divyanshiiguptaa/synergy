import React, { useState } from 'react';
import { Download, FileText, Users, BarChart3, Check } from 'lucide-react';
import type { SpatialMatch } from '../utils/spatial';
import { exportToCSV, exportContactList, exportInfrastructureSummary } from '../utils/export';
import Button from './Button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  spatialResults: SpatialMatch[];
}

interface ExportOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

function ExportModal({ isOpen, onClose, spatialResults }: ExportModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const exportOptions: ExportOption[] = [
    {
      id: 'project-summary',
      title: 'Project Summary Report',
      description: 'Complete project details with contact info and infrastructure impact',
      icon: <FileText className="w-5 h-5" />,
      action: () => exportToCSV(spatialResults, {
        includeContactInfo: true,
        includeInfrastructureImpact: true,
        includeCostData: true
      })
    },
    {
      id: 'contact-list',
      title: 'Project Manager Contacts',
      description: 'Dedicated contact list for all project managers',
      icon: <Users className="w-5 h-5" />,
      action: () => exportContactList(spatialResults)
    },
    {
      id: 'infrastructure-impact',
      title: 'Infrastructure Impact Summary',
      description: 'Summary of infrastructure affected by projects',
      icon: <BarChart3 className="w-5 h-5" />,
      action: () => exportInfrastructureSummary(spatialResults)
    }
  ];

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleExport = async () => {
    if (selectedOptions.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Export each selected option
      for (const optionId of selectedOptions) {
        const option = exportOptions.find(opt => opt.id === optionId);
        if (option) {
          option.action();
          // Small delay between exports to prevent browser blocking
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = () => {
    setIsExporting(true);
    
    try {
      exportOptions.forEach(option => option.action());
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md max-h-[calc(100vh-2rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Select the reports you'd like to export. All files will be downloaded as CSV format.
          </p>

          {/* Export Options */}
          <div className="space-y-3">
            {exportOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedOptions.includes(option.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleOptionToggle(option.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedOptions.includes(option.id)
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                  </div>
                  {selectedOptions.includes(option.id) && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {selectedOptions.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{selectedOptions.length}</span> report{selectedOptions.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExportAll}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All
            </Button>
            {selectedOptions.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : `Export Selected (${selectedOptions.length})`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal; 