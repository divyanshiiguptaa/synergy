import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Layers, Info } from 'lucide-react';
import { loadDatasets } from '../utils/data-loader';
import { findSpatialMatches, type SpatialMatch } from '../utils/spatial';
import type { LayerConfig } from '../configs/layerConfig';
import Collapsible from './Collapsible';
import ErrorIcon from '../icons/error-icon';
import Card from './Card';

interface MapComponentProps {
  accessToken: string;
  layerConfig: LayerConfig;
  initialLng?: number;
  initialLat?: number;
  initialZoom?: number;
  spatialResults: SpatialMatch[];
  selectedMatch: SpatialMatch | null;
  onResultsUpdate: (results: SpatialMatch[]) => void;
  onMatchSelect: (match: SpatialMatch | null) => void;
  statusFilter?: string;
  dateRange?: { start: string; end: string };
  costRange?: { min: string; max: string };
}

function MapComponent({ 
  accessToken, 
  layerConfig, 
  initialLng = -118.2437,
  initialLat = 34.0522,
  initialZoom = 10,
  spatialResults,
  selectedMatch,
  onResultsUpdate,
  onMatchSelect,

}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({});
  const [referenceData, setReferenceData] = useState<any>(null);
  const [targetDatasets, setTargetDatasets] = useState<any[]>([]);

  const [hoverTooltip, setHoverTooltip] = useState<{ x: number; y: number } | null>(null);
  const [hoverDisabled, setHoverDisabled] = useState<boolean>(false);

  // Initialize layer visibility state
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {
      reference: true
    };
    
    layerConfig.target.forEach((index) => {
      initialVisibility[`target-${index}`] = true;
      initialVisibility[`matches-${index}`] = true;
    });
    
    setLayerVisibility(initialVisibility);
  }, [layerConfig.target]);

  // 1. Ensure all checkboxes are checked by default
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = { reference: true };
    layerConfig.target.forEach((_, idx) => {
      initialVisibility[`target-${idx}`] = true;
      initialVisibility[`matches-${idx}`] = true;
    });
    setLayerVisibility(initialVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerConfig.target.length]);

  // Load data and perform spatial analysis
  const loadDataAndAnalyze = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { reference, targets } = await loadDatasets(
        layerConfig.reference.file,
        layerConfig.target
      );

      // Perform spatial analysis using unified function
      const results = findSpatialMatches(
        reference.features,
        targets.map(t => t.features),
        layerConfig.target
      );
      onResultsUpdate(results.matches);

      // Store reference and target data for later use
      setReferenceData(reference);
      setTargetDatasets(targets);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [layerConfig]);

  // Add data to map when spatial results are available
  useEffect(() => {
    if (map.current && referenceData && targetDatasets.length > 0) {
      addDataToMap(referenceData, targetDatasets);
    }
  }, [spatialResults, referenceData, targetDatasets]);

  // Add data layers to map
  const addDataToMap = useCallback((
    referenceData: any,
    targetDatasets: any[]
  ) => {
    if (!map.current) return;

    // Clear existing layers and sources
    const layersToRemove = [
      'reference-fill', 'reference-fill-matches', 'reference-border'
    ];
    
    // Add target layer IDs
    targetDatasets.forEach((_, index) => {
      layersToRemove.push(`target-points-${index}`, `matched-target-points-${index}`);
    });

    // Remove existing layers
    layersToRemove.forEach(layerId => {
      if (map.current!.getLayer(layerId)) {
        map.current!.removeLayer(layerId);
      }
    });

    // Remove existing sources
    const sourcesToRemove = ['reference-data'];
    targetDatasets.forEach((_, index) => {
      sourcesToRemove.push(`target-data-${index}`, `matched-target-data-${index}`);
    });

    sourcesToRemove.forEach(sourceId => {
      if (map.current!.getSource(sourceId)) {
        map.current!.removeSource(sourceId);
      }
    });

    // Create a map of reference feature IDs to match counts
    const matchCountMap = new Map();
    
    spatialResults.forEach(match => {
      const objectId = match.referenceFeature.properties?.OBJECTID;
      if (objectId) {
        matchCountMap.set(objectId, match.totalMatchCount);
      }
    });

    // Add matchCount property to reference features
    const enhancedReferenceData = {
      ...referenceData,
      features: referenceData.features.map((feature: any) => ({
        ...feature,
        properties: {
          ...feature.properties,
          matchCount: matchCountMap.get(feature.properties?.OBJECTID) || 0
        }
      }))
    };

    // Add reference layer (CIP projects)
    map.current.addSource('reference-data', {
      type: 'geojson',
      data: enhancedReferenceData
    });

    map.current.addLayer({
      id: 'reference-fill',
      type: 'fill',
      source: 'reference-data',
      paint: {
        'fill-color': layerConfig.reference.fillColor || layerConfig.reference.color,
        'fill-opacity': layerConfig.reference.fillOpacity || 0.1
      },
      filter: ['==', ['get', 'matchCount'], 0]
    });

    map.current.addLayer({
      id: 'reference-fill-matches',
      type: 'fill',
      source: 'reference-data',
      paint: {
        'fill-color': '#FF6B35',
        'fill-opacity': 0.3
      },
      filter: ['>', ['get', 'matchCount'], 0]
    });

    map.current.addLayer({
      id: 'reference-border',
      type: 'line',
      source: 'reference-data',
      paint: {
        'line-color': layerConfig.reference.color,
        'line-width': 2
      }
    });

    // Add target layers
    targetDatasets.forEach((targetData, index) => {
      const targetConfig = layerConfig.target[index];
      const isPointLayer = targetConfig.geometryType === 'Point';
      const sourceId = `target-data-${index}`;

      // Add target source with clustering if point layer
      map.current!.addSource(sourceId, {
        type: 'geojson',
        data: targetData,
        ...(isPointLayer ? { cluster: true, clusterRadius: 50, clusterMaxZoom: 14 } : {})
      });

      if (isPointLayer) {
        // Cluster circles
        map.current!.addLayer({
          id: `target-clusters-${index}`,
          type: 'circle',
          source: sourceId,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': targetConfig.color,
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              15, 10,
              20, 50,
              25, 100,
              30
            ],
            'circle-opacity': 0.7
          }
        });
        // Cluster count labels
        map.current!.addLayer({
          id: `target-cluster-count-${index}`,
          type: 'symbol',
          source: sourceId,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 13
          },
          paint: {
            'text-color': '#fff',
            'text-halo-color': '#222',
            'text-halo-width': 1.5
          }
        });
        // Unclustered points (only those not in a cluster)
        map.current!.addLayer({
          id: `target-points-${index}`,
          type: 'circle',
          source: sourceId,
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-radius': targetConfig.size || 6,
            'circle-color': targetConfig.color,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });
        // Cluster click to zoom
        map.current!.on('click', `target-clusters-${index}`, (e) => {
          const features = map.current!.queryRenderedFeatures(e.point, { layers: [`target-clusters-${index}`] });
          const clusterId = features[0].properties?.cluster_id;
          // Type guard for Point geometry
          const geom = features[0].geometry;
          if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
            (map.current!.getSource(sourceId) as any).getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
              if (err) return;
              map.current!.easeTo({ center: geom.coordinates as [number, number], zoom });
            });
          }
        });
        map.current!.on('mouseenter', `target-clusters-${index}`, () => {
          map.current!.getCanvas().style.cursor = 'pointer';
        });
        map.current!.on('mouseleave', `target-clusters-${index}`, () => {
          map.current!.getCanvas().style.cursor = '';
        });
      } else {
        // Non-point layers (lines/polygons)
        map.current!.addLayer({
          id: `target-points-${index}`,
          type: 'circle',
          source: sourceId,
          paint: {
            'circle-radius': targetConfig.size || 6,
            'circle-color': targetConfig.color,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });
      }

      // Add matched target points with different styling (not clustered)
      const matchedTargetFeatures = spatialResults.flatMap(match => 
        match.targetMatches[index]?.targetFeatures || []
      );

      if (matchedTargetFeatures.length > 0) {
        const matchedTargetData: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: matchedTargetFeatures
        };

        map.current!.addSource(`matched-target-data-${index}`, {
          type: 'geojson',
          data: matchedTargetData
        });

        map.current!.addLayer({
          id: `matched-target-points-${index}`,
          type: 'circle',
          source: `matched-target-data-${index}`,
          paint: {
            'circle-radius': (targetConfig.size || 6) + 2,
            'circle-color': '#FF6B35',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      }
    });

    // Add click handlers
    map.current.on('click', 'reference-fill-matches', (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const match = spatialResults.find(m => 
          m.referenceFeature.properties?.OBJECTID === feature.properties?.OBJECTID
        );
        
        if (match) {
          onMatchSelect(match);
        }
      }
      setHoverTooltip(null);
      setHoverDisabled(true);
    });

    map.current.on('mouseenter', 'reference-fill-matches', (e) => {
      if (map.current) {
        map.current.getCanvas().style.cursor = 'pointer';
        if (e.originalEvent && !hoverDisabled) {
          setHoverTooltip({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
        }
      }
    });

    map.current.on('mousemove', 'reference-fill-matches', (e) => {
      if (e.originalEvent && !hoverDisabled) {
        setHoverTooltip({ x: e.originalEvent.clientX, y: e.originalEvent.clientY });
      }
    });

    map.current.on('mouseleave', 'reference-fill-matches', () => {
      if (map.current) {
        map.current.getCanvas().style.cursor = '';
        setHoverTooltip(null);
      }
    });
  }, [layerConfig, spatialResults, onMatchSelect, hoverDisabled]);

  // Re-enable hover ONLY when selectedMatch becomes null (deselection)
  useEffect(() => {
    if (selectedMatch === null) {
      setHoverDisabled(false);
    }
  }, [selectedMatch]);

  // 2. Fix toggleLayer to toggle all relevant EV Charger layers
  const toggleLayer = useCallback((layerType: string) => {
    const newVisibility = { ...layerVisibility, [layerType]: !layerVisibility[layerType] };
    setLayerVisibility(newVisibility);

    if (!map.current) return;
    let layerIds: string[] = [];
    if (layerType === 'reference') {
      layerIds = ['reference-fill', 'reference-fill-matches', 'reference-border'];
    } else if (layerType.startsWith('target-')) {
      const index = parseInt(layerType.split('-')[1]);
      layerIds = [
        `target-clusters-${index}`,
        `target-cluster-count-${index}`,
        `target-points-${index}`
      ];
    } else if (layerType.startsWith('matches-')) {
      const index = parseInt(layerType.split('-')[1]);
      layerIds = [`matched-target-points-${index}`];
    }
    layerIds.forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', newVisibility[layerType] ? 'visible' : 'none');
      }
    });
  }, [layerVisibility, setLayerVisibility]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [initialLng, initialLat],
      zoom: initialZoom
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      loadDataAndAnalyze();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [accessToken, initialLng, initialLat, initialZoom, loadDataAndAnalyze]);

  // Calculate summary stats
  const getSummaryStats = () => {
    const totalProjects = spatialResults.length;
    const totalTargets = spatialResults.reduce((sum, match) => sum + match.totalMatchCount, 0);
    const targetName = layerConfig.target.length === 1 
      ? layerConfig.target[0].name 
      : 'Infrastructure';
    
    return {
      projectsWithTargets: totalProjects,
      totalTargetsAffected: totalTargets,
      targetName
    };
  };

  const summaryStats = getSummaryStats();

  useEffect(() => {
    if (!map.current || !selectedMatch) return;

    const feature = selectedMatch.referenceFeature;
    const geometry = feature.geometry;

    if (!geometry) return;

    // Helper: get bounds for Polygon/MultiPolygon
    function getFeatureBounds(geometry: any): mapboxgl.LngLatBoundsLike | null {
      if (geometry.type === 'Polygon') {
        // geometry.coordinates: [ [ [lng, lat], ... ] ]
        const coords = geometry.coordinates[0];
        const bounds = new mapboxgl.LngLatBounds(coords[0], coords[0]);
        coords.forEach(([lng, lat]: [number, number]) => bounds.extend([lng, lat]));
        return bounds;
      }
      if (geometry.type === 'MultiPolygon') {
        // geometry.coordinates: [ [ [ [lng, lat], ... ] ], ... ]
        let bounds: mapboxgl.LngLatBounds | null = null;
        geometry.coordinates.forEach((polygon: [ [number, number][] ]) => {
          polygon[0].forEach(([lng, lat]: [number, number]) => {
            if (!bounds) bounds = new mapboxgl.LngLatBounds([lng, lat], [lng, lat]);
            else bounds.extend([lng, lat]);
          });
        });
        return bounds;
      }
      return null;
    }

    if (geometry.type === 'Point') {
      const [lng, lat] = geometry.coordinates;
      map.current.flyTo({ center: [lng, lat], zoom: 15, essential: true });
    } else {
      const bounds = getFeatureBounds(geometry);
      if (bounds) {
        map.current.fitBounds(bounds, { padding: 60, duration: 800 });
      }
    }
  }, [selectedMatch]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: '100vh' }}
      />
      {/* Hover Tooltip */}
      {hoverTooltip && !hoverDisabled && (
        <div
          className="fixed z-50 px-2 py-1 bg-black text-white text-xs rounded shadow-lg border border-black flex items-center gap-1 pointer-events-none animate-fade-in"
          style={{ left: hoverTooltip.x + 10, top: hoverTooltip.y + 10, minWidth: 120 }}
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <span className="font-medium">Click to explore project</span>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project data...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 z-40">
          <div className="flex">
            <div className="flex-shrink-0">
              <ErrorIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Layer Controls */}
      <div className="absolute top-4 left-4 z-30 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-0">
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

      {/* Map Legend */}
      <Card 
        title={<h3 className="text-sm font-medium text-gray-900">Legend</h3>}
        position="bottom-right"
        className="min-w-[180px]"
      >
        <div className="flex flex-col space-y-2">
          {/* CIP Projects */}
          <div className="flex items-center space-x-2">
            <span className="inline-block w-5 h-3 rounded-sm" style={{ backgroundColor: layerConfig.reference.fillColor || layerConfig.reference.color, opacity: 0.7, border: `2px solid ${layerConfig.reference.color}` }}></span>
            <span className="text-sm text-gray-700">{layerConfig.reference.name}</span>
          </div>
          {/* EV Chargers */}
          {layerConfig.target.map((target, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="inline-block w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: target.color }}></span>
              <span className="text-sm text-gray-700">{target.name}</span>
            </div>
          ))}
          {/* Matched EV Chargers */}
          {layerConfig.target.map((target, idx) => (
            <div key={idx + '-matched'} className="flex items-center space-x-2">
              <span className="inline-block w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: '#FF6B35' }}></span>
              <span className="text-sm text-gray-700">Affected {target.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Summary</h3>
          </div>
        }
        position="bottom-left"
      >
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">
            Projects with {summaryStats.targetName}: <span className="font-semibold text-gray-900">{summaryStats.projectsWithTargets}</span>
          </p>
          <p className="text-gray-600">
            Total {summaryStats.targetName} affected: <span className="font-semibold text-gray-900">{summaryStats.totalTargetsAffected}</span>
          </p>
        </div>
      </Card>


    </div>
  );
}

export default MapComponent;
