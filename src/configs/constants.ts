/**
 * Application Constants
 * Centralized location for all application constants and configuration values
 */

// ============================================================================
// MAP CONFIGURATION
// ============================================================================

export const MAP_CONSTANTS = {
  // Default map settings
  DEFAULT_LNG: -118.2437,
  DEFAULT_LAT: 34.0522,
  DEFAULT_ZOOM: 10,
  
  // Clustering settings
  CLUSTER_RADIUS: 50,
  CLUSTER_MAX_ZOOM: 14,
  
  // Layer styling
  POINT_SIZE: 6,
  BORDER_WIDTH: 1,
  BORDER_COLOR: '#ffffff',
  
  // Opacity settings
  DEFAULT_FILL_OPACITY: 0.1,
  MATCH_FILL_OPACITY: 0.3,
  CLUSTER_OPACITY: 0.7,
  
  // Cluster circle sizes
  CLUSTER_SIZES: {
    SMALL: 15,
    MEDIUM: 20,
    LARGE: 25,
    EXTRA_LARGE: 30
  },
  
  // Cluster thresholds
  CLUSTER_THRESHOLDS: {
    SMALL: 10,
    MEDIUM: 50,
    LARGE: 100
  }
} as const;

// ============================================================================
// COLORS AND THEMING
// ============================================================================

export const COLORS = {
  // Primary colors
  PRIMARY: {
    BLUE: '#3B82F6',
    GREEN: '#10B981',
    ORANGE: '#FF6B35',
    RED: '#EF4444',
    YELLOW: '#F59E0B',
    PURPLE: '#8B5CF6',
    GRAY: '#6B7280'
  },
  
  // Semantic colors
  SEMANTIC: {
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  },
  
  // UI colors
  UI: {
    BORDER: '#E5E7EB',
    BACKGROUND: '#F9FAFB',
    SURFACE: '#FFFFFF',
    TEXT: {
      PRIMARY: '#111827',
      SECONDARY: '#6B7280',
      MUTED: '#9CA3AF'
    }
  }
} as const;

// ============================================================================
// LAYER CONFIGURATION
// ============================================================================

export const LAYER_IDS = {
  REFERENCE: {
    FILL: 'reference-fill',
    FILL_MATCHES: 'reference-fill-matches',
    BORDER: 'reference-border'
  },
  TARGET: {
    CLUSTERS: (index: number) => `target-clusters-${index}`,
    CLUSTER_COUNT: (index: number) => `target-cluster-count-${index}`,
    POINTS: (index: number) => `target-points-${index}`,
    MATCHED_POINTS: (index: number) => `matched-target-points-${index}`
  },
  SOURCES: {
    REFERENCE: 'reference-data',
    TARGET: (index: number) => `target-data-${index}`,
    MATCHED_TARGET: (index: number) => `matched-target-data-${index}`
  }
} as const;

// Helper functions to get layer IDs
export const getReferenceLayerId = (type: keyof typeof LAYER_IDS.REFERENCE): string => {
  return LAYER_IDS.REFERENCE[type];
};

export const getTargetLayerId = (type: keyof typeof LAYER_IDS.TARGET, index: number): string => {
  return LAYER_IDS.TARGET[type](index);
};

export const getSourceId = (type: keyof typeof LAYER_IDS.SOURCES, index?: number): string => {
  if (type === 'REFERENCE') {
    return LAYER_IDS.SOURCES.REFERENCE;
  }
  if (index !== undefined) {
    return LAYER_IDS.SOURCES[type](index);
  }
  throw new Error(`Index required for source type: ${type}`);
};

// ============================================================================
// UI CONSTANTS
// ============================================================================

export const UI_CONSTANTS = {
  // Panel dimensions
  PANEL: {
    WIDTH: 384, // w-96 = 24rem = 384px
    MARGIN: 16,
    MIN_HEIGHT: 200
  },
  
  // Z-index levels
  Z_INDEX: {
    MAP: 0,
    CONTROLS: 10,
    PANELS: 20,
    MODALS: 30,
    TOOLTIPS: 40
  },
  
  // Animation durations
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  
  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32
  }
} as const;

// ============================================================================
// DATA CONSTANTS
// ============================================================================

export const DATA_CONSTANTS = {
  // Default field values
  DEFAULTS: {
    UNKNOWN: 'Unknown',
    N_A: 'N/A',
    UNTITLED_PROJECT: 'Untitled Project',
    CITY_OF_LA: 'City of Los Angeles'
  },
  
  // Date formats
  DATE_FORMATS: {
    DISPLAY: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  },
  
  // File paths
  PATHS: {
    CIP_PROJECTS: '/data/cip_projects.json',
    EV_CHARGERS: '/data/ev_chargers.json'
  }
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  ENABLE_EXPORT: true,
  ENABLE_FILTERS: true,
  ENABLE_CLUSTERING: true,
  ENABLE_TOOLTIPS: true
} as const;

// ============================================================================
// STATUS OPTIONS
// ============================================================================

export const STATUS_OPTIONS = [
  'All',
  'Planned',
  'In Progress',
  'Completed',
  'On Hold'
] as const;



// ============================================================================
// EXPORT CONSTANTS
// ============================================================================

export const EXPORT_CONSTANTS = {
  // CSV settings
  CSV: {
    MIME_TYPE: 'text/csv;charset=utf-8;',
    ENCODING: 'utf-8'
  },
  
  // File naming
  FILENAMES: {
    SPATIAL_RESULTS: (date: string) => `spatial-analysis-${date}.csv`,
    CONTACT_LIST: (date: string) => `project-managers-${date}.csv`,
    INFRASTRUCTURE_SUMMARY: (date: string) => `infrastructure-impact-${date}.csv`
  },
  
  // Headers
  HEADERS: {
    SPATIAL_RESULTS: [
      'Project Title',
      'Project Number',
      'Department',
      'Start Date',
      'End Date',
      'Construction Cost',
      'Project Manager',
      'Phone',
      'Email',
      'Total Matches',
      'Infrastructure Breakdown'
    ],
    CONTACT_LIST: [
      'Project Manager',
      'Phone',
      'Email',
      'Department',
      'Project Title',
      'Project Number'
    ],
    INFRASTRUCTURE_SUMMARY: [
      'Infrastructure Type',
      'Subcategory',
      'Count',
      'Affected Projects'
    ]
  }
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  MAP_LOADING: 'Failed to load map',
  DATA_LOADING: 'Failed to load data',
  SPATIAL_ANALYSIS: 'Spatial analysis error',
  EXPORT_FAILED: 'Export failed',
  MISSING_ENV_VARS: 'Missing required environment variables'
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get cluster radius based on point count
 */
export function getClusterRadius(pointCount: number): number {
  if (pointCount >= MAP_CONSTANTS.CLUSTER_THRESHOLDS.LARGE) {
    return MAP_CONSTANTS.CLUSTER_SIZES.EXTRA_LARGE;
  } else if (pointCount >= MAP_CONSTANTS.CLUSTER_THRESHOLDS.MEDIUM) {
    return MAP_CONSTANTS.CLUSTER_SIZES.LARGE;
  } else if (pointCount >= MAP_CONSTANTS.CLUSTER_THRESHOLDS.SMALL) {
    return MAP_CONSTANTS.CLUSTER_SIZES.MEDIUM;
  }
  return MAP_CONSTANTS.CLUSTER_SIZES.SMALL;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get layer visibility key for target layers
 */
export function getTargetLayerKey(index: number): string {
  return `target-${index}`;
}

/**
 * Get layer visibility key for match layers
 */
export function getMatchLayerKey(index: number): string {
  return `matches-${index}`;
} 