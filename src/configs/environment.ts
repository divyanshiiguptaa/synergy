/**
 * Environment configuration for the application
 * All environment variables are prefixed with VITE_ for Vite to expose them
 */

interface EnvironmentConfig {
  // Mapbox Configuration
  MAPBOX_ACCESS_TOKEN: string;
  
  // App Configuration
  APP_TITLE: string;
  APP_DESCRIPTION: string;
  
  // Feature Flags
  ENABLE_EXPORT: boolean;
  ENABLE_FILTERS: boolean;
  
  // API Configuration (for future use)
  API_BASE_URL?: string;
  API_KEY?: string;
}

// Helper function to get environment variable with fallback
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback;
}

// Helper function to get boolean environment variable
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = getEnvVar(key);
  return value === 'true' || value === '1' || fallback;
}

export const environment: EnvironmentConfig = {
  // Mapbox Configuration
  MAPBOX_ACCESS_TOKEN: getEnvVar('VITE_MAPBOX_ACCESS_TOKEN', 'pk.eyJ1IjoiZGhydXZpbmFtZGFyMjgiLCJhIjoiY21jenk1bm9uMHZpdTJpc2F2dTloYmpyYSJ9.hn0Lsv3QXysMx9bjkEewYg'),
  
  // App Configuration
  APP_TITLE: getEnvVar('VITE_APP_TITLE', 'Synergy - LA Infrastructure Analysis'),
  APP_DESCRIPTION: getEnvVar('VITE_APP_DESCRIPTION', 'Visualizing Capital Improvement Projects and EV Chargers in Los Angeles'),
  
  // Feature Flags
  ENABLE_EXPORT: getBooleanEnvVar('VITE_ENABLE_EXPORT', true),
  ENABLE_FILTERS: getBooleanEnvVar('VITE_ENABLE_FILTERS', true),
  
  // API Configuration (optional)
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
  API_KEY: getEnvVar('VITE_API_KEY'),
};

// Validate required environment variables
export function validateEnvironment(): void {
  const requiredVars = ['MAPBOX_ACCESS_TOKEN'];
  const missingVars = requiredVars.filter(varName => !environment[varName as keyof EnvironmentConfig]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Please check your .env file or environment configuration.');
  }
}

// Export individual getters for convenience
export const getMapboxToken = (): string => environment.MAPBOX_ACCESS_TOKEN;
export const getAppTitle = (): string => environment.APP_TITLE;
export const getAppDescription = (): string => environment.APP_DESCRIPTION;
export const isExportEnabled = (): boolean => environment.ENABLE_EXPORT;
export const isFiltersEnabled = (): boolean => environment.ENABLE_FILTERS; 