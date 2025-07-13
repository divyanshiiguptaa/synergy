import { useState, useCallback, useEffect } from "react";
import MapComponent from "./components/MapComponent";
import InfoPanel from "./components/InfoPanel";
import { defaultLayerConfig } from "./configs/layerConfig";
import type { SpatialMatch } from "./utils/spatial";
import "./App.css";
import { Funnel } from "lucide-react";
import Button from "./components/Button";
import TopBar from "./components/TopBar";
import InfoModal from "./components/InfoModal";
import PopupPanel from './components/PopupPanel';
import Collapsible from "./components/Collapsible";
import { Layers } from "lucide-react";
import React from "react";
import { getMapboxToken, validateEnvironment } from "./configs/environment";
import { STATUS_OPTIONS } from "./configs/constants";


function App() {
  // Validate environment variables on app start
  useEffect(() => {
    validateEnvironment();
  }, []);

  // Get Mapbox access token from environment
  const MAPBOX_ACCESS_TOKEN = getMapboxToken();

  // Use the default configuration (CIP Projects vs EV Chargers)
  // To use different configurations, import and use them from example-configs.ts
  const layerConfig = defaultLayerConfig;

  // State management lifted up from MapComponent
  const [spatialResults, setSpatialResults] = useState<SpatialMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SpatialMatch | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  // New filter state
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [costRange, setCostRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false); // New state for filters modal

  // State for info modal
  const [showInfo, setShowInfo] = useState(false);

  // Layer visibility state
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    reference: true,
  });

  // Handler for layer visibility toggle
  const toggleLayer = (key: string) => {
    setLayerVisibility(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  // Handlers for MapComponent
  const handleResultsUpdate = useCallback((results: SpatialMatch[]) => {
    setSpatialResults(results);
  }, []);

  const handleMatchSelect = useCallback((match: SpatialMatch | null) => {
    setSelectedMatch(match);
    setShowInfoPanel(match !== null);
  }, []);

  const handleCloseInfoPanel = useCallback(() => {
    setShowInfoPanel(false);
    setSelectedMatch(null);
  }, []);

  // Status options from constants
  const statusOptions = STATUS_OPTIONS;

  const clearFilters = useCallback(() => {
    setStatusFilter("All");
    setDateRange({ start: "", end: "" });
    setCostRange({ min: "", max: "" });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <TopBar 
        title="Synergy"
        subtitle="Spatial Analysis Platform"
        spatialResults={spatialResults}
        layerConfig={layerConfig}
        onInfoClick={() => setShowInfo(true)}
        onFiltersClick={() => setShowFilters(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Layer Controls - Top Left */}
        <div className="absolute top-4 left-4 z-30 flex flex-col items-start gap-3">
          {/* Layers Panel */}
          <div className="w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-0">
            <Collapsible
              header={
                <>
                  <Layers className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-base font-semibold text-gray-900 flex-1 text-left">Layers</h3>
                </>
              }
              defaultOpen={false}
            >
              <div className="flex flex-col items-start mt-3 pl-4 space-y-2 pb-2">
                <label className="flex items-center gap-3 w-full cursor-pointer"> 
                  <input
                    type="checkbox"
                    checked={layerVisibility.reference}
                    onChange={() => toggleLayer('reference')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="text-sm font-medium text-gray-800">{layerConfig.reference.name}</span>
                </label>
                {layerConfig.target.map((target, index) => {
                  return (
                    <React.Fragment key={index}>
                      <label className="flex items-center gap-3 w-full cursor-pointer">
                        <input
                          type="checkbox"
                          checked={layerVisibility[`target-${index}`]}
                          onChange={() => toggleLayer(`target-${index}`)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <span className="text-sm font-medium text-gray-800">{target.name}</span>
                      </label>
                      <label className="flex items-center gap-3 w-full cursor-pointer"> 
                        <input
                          type="checkbox"
                          checked={layerVisibility[`matches-${index}`]}
                          onChange={() => toggleLayer(`matches-${index}`)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                        />
                        <span className="text-sm font-medium text-gray-800">Affected {target.name}</span>
                      </label>
                    </React.Fragment>
                  );
                })}
              </div>
            </Collapsible>
          </div>
        </div>
        {/* MapComponent */}
        <MapComponent 
          accessToken={MAPBOX_ACCESS_TOKEN}
          layerConfig={layerConfig}
          initialLng={-118.2437}
          initialLat={34.0522}
          initialZoom={10}
          spatialResults={spatialResults}
          selectedMatch={selectedMatch}
          onResultsUpdate={handleResultsUpdate}
          onMatchSelect={handleMatchSelect}
          statusFilter={statusFilter}
          dateRange={dateRange}
          costRange={costRange}
        />
        {/* Info Panel rendered at App level */}
        {showInfoPanel && selectedMatch && (
          <InfoPanel
            selectedMatch={selectedMatch}
            onClose={handleCloseInfoPanel}
            layerConfig={layerConfig}
          />
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <PopupPanel
          title={
            <div className="flex items-center gap-2">
              <Funnel className="w-5 h-5 text-blue-600" />
              Filters
            </div>
          }
          onClose={() => setShowFilters(false)}
          position="center"
        >
          {/* Status Section */}
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-700 mb-2">Status</div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`px-3 py-1 rounded-full border text-sm ${statusFilter === status ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          {/* Date Range Section */}
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-700 mb-2">Date Range</div>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={dateRange.start}
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <span className="text-xs text-gray-500">to</span>
              <input
                type="date"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={dateRange.end}
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
          {/* Cost Range Section */}
          <div className="mb-6">
            <div className="text-xs font-bold text-gray-700 mb-2">Cost Range ($)</div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                value={costRange.min}
                onChange={e => setCostRange({ ...costRange, min: e.target.value })}
              />
              <span className="text-xs text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="border border-gray-300 rounded px-2 py-1 text-sm w-20"
                value={costRange.max}
                onChange={e => setCostRange({ ...costRange, max: e.target.value })}
              />
            </div>
          </div>
          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Clear Filters
            </Button>
          </div>
        </PopupPanel>
      )}

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="How to Use This Map"
      />
    </div>
  );
}

export default App;