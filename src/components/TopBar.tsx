import { useState, useRef, useEffect } from 'react';
import { MapPin, Info, Settings, Download, ChevronDown, FileText, Users, BarChart3, Funnel, Sun, Moon, Monitor, Check } from 'lucide-react';
import Button from './Button';
import SearchBar from './SearchBar';
import { exportToCSV, exportContactList, exportInfrastructureSummary } from '../utils/export';
import type { SpatialMatch } from '../utils/spatial';
import type { LayerConfig } from '../configs/layerConfig';

export interface TopBarProps {
  title?: string;
  subtitle?: string;
  showInfo?: boolean;
  showExport?: boolean;
  showFilters?: boolean;
  spatialResults?: SpatialMatch[];
  layerConfig?: LayerConfig;
  onInfoClick?: () => void;
  onFiltersClick?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
  className?: string;
}

function TopBar({ 
  title = "Synergy",
  subtitle = "Spatial Analysis Platform",
  showInfo = true,
  showExport = true,
  showFilters = true,
  spatialResults = [],
  layerConfig,
  onInfoClick,
  onFiltersClick,
  theme = 'system',
  onThemeChange,
  className = ""
}: TopBarProps) {
  // Local state for search input
  const [search, setSearch] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const settingsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target as Node)) {
        setShowThemeDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Export functions
  const handleExportProjectSummary = () => {
    exportToCSV(spatialResults, {
      includeContactInfo: true,
      includeInfrastructureImpact: true,
      includeCostData: true,
      layerConfig
    });
    setShowExportDropdown(false);
  };

  const handleExportContacts = () => {
    exportContactList(spatialResults);
    setShowExportDropdown(false);
  };

  const handleExportInfrastructure = () => {
    exportInfrastructureSummary(spatialResults, layerConfig);
    setShowExportDropdown(false);
  };

  const handleExportAll = () => {
    exportToCSV(spatialResults, {
      includeContactInfo: true,
      includeInfrastructureImpact: true,
      includeCostData: true,
      layerConfig
    });
    exportContactList(spatialResults);
    exportInfrastructureSummary(spatialResults, layerConfig);
    setShowExportDropdown(false);
  };

  return (
    <div className={`bg-white border-b border-gray-200 shadow-sm px-2 py-1 flex items-center justify-between ${className}`}>
      {/* Left side - Title and subtitle */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        <div>
          <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-600">{subtitle}</p>
          )}
        </div>
      </div>
      {/* Right side - Search Bar and Actions */}
      <div className="flex items-center space-x-2">
        {/* Search bar */}
        <SearchBar value={search} onChange={setSearch} placeholder="Search by Project..." />
        {/* Filters button */}
        {showFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFiltersClick}
            className="flex items-center gap-1 px-1 py-0.5"
            title="Filters"
            aria-label="Filters"
          >
            <Funnel className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Filters</span>
          </Button>
        )}
        {/* Info button, etc. */}
        {showInfo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onInfoClick}
            className="flex items-center gap-1 px-1 py-0.5"
            title="Information"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Info</span>
          </Button>
        )}
        {showExport && (
          <div className="relative" ref={exportDropdownRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="flex items-center gap-1 px-1 py-0.5"
              title="Export Data"
              aria-label="Export Data"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Export</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
            {showExportDropdown && (
              <div
                className="absolute right-0 top-full mt-2 min-w-[210px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] py-2"
                style={{ marginTop: '0.75rem' }}
                role="menu"
                aria-label="Export options"
              >
                <button
                  onClick={handleExportProjectSummary}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-100 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  Project Summary
                </button>
                <button
                  onClick={handleExportContacts}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-100 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <Users className="w-4 h-4 text-blue-600" />
                  Contact List
                </button>
                <button
                  onClick={handleExportInfrastructure}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-100 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Infrastructure Impact
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <button
                  onClick={handleExportAll}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-blue-700 hover:bg-blue-100 focus:bg-blue-200 rounded-lg transition-colors"
                  role="menuitem"
                >
                  <Download className="w-4 h-4 text-blue-700" />
                  Export All
                </button>
              </div>
            )}
          </div>
        )}
        {/* Settings button with theme dropdown */}
        <div className="relative" ref={settingsDropdownRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThemeDropdown((v) => !v)}
            className="flex items-center gap-1 px-1 py-0.5"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Settings</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
          {showThemeDropdown && (
            <div
              className="absolute right-0 top-full mt-2 min-w-[180px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[100] py-2"
              style={{ marginTop: '0.75rem' }}
              role="menu"
              aria-label="Theme options"
            >
              <button
                onClick={() => { onThemeChange && onThemeChange('light'); setShowThemeDropdown(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-100 rounded-lg transition-colors ${theme === 'light' ? 'font-semibold text-blue-700' : ''}`}
                role="menuitem"
              >
                <Sun className="w-4 h-4 text-yellow-500" />
                Light
                {theme === 'light' && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
              </button>
              <button
                onClick={() => { onThemeChange && onThemeChange('dark'); setShowThemeDropdown(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-100 rounded-lg transition-colors ${theme === 'dark' ? 'font-semibold text-blue-700' : ''}`}
                role="menuitem"
              >
                <Moon className="w-4 h-4 text-gray-800" />
                Dark
                {theme === 'dark' && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
              </button>
              <button
                onClick={() => { onThemeChange && onThemeChange('system'); setShowThemeDropdown(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 focus:bg-blue-100 rounded-lg transition-colors ${theme === 'system' ? 'font-semibold text-blue-700' : ''}`}
                role="menuitem"
              >
                <Monitor className="w-4 h-4 text-blue-500" />
                System
                {theme === 'system' && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar; 