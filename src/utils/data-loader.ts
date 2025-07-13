

export interface GeoJSONData {
  type: string;
  features: any[];
}

/**
 * Load GeoJSON data from a file
 * @param filePath - Path to the GeoJSON file
 * @returns Promise with parsed GeoJSON data
 */
export async function loadGeoJSONData(filePath: string): Promise<GeoJSONData> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load data from ${filePath}: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (!data.type || !data.features) {
      throw new Error(`Invalid GeoJSON format in ${filePath}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error loading GeoJSON data from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Load both reference and target datasets
 * @param referencePath - Path to reference dataset
 * @param targetConfigs - Array of target configurations
 * @returns Promise with reference and target datasets
 */
export async function loadDatasets(
  referencePath: string,
  targetConfigs: Array<{ file: string }>
): Promise<{ reference: GeoJSONData; targets: GeoJSONData[] }> {
  try {
    const reference = await loadGeoJSONData(referencePath);
    
    const targetPromises = targetConfigs.map(config => loadGeoJSONData(config.file));
    const targets = await Promise.all(targetPromises);
    
    return { reference, targets };
  } catch (error) {
    console.error('Error loading datasets:', error);
    throw error;
  }
}

/**
 * Validate dataset structure
 * @param data - GeoJSON data to validate
 * @param expectedGeometryType - Expected geometry type
 * @returns Validation result
 */
export function validateDataset(data: GeoJSONData, expectedGeometryType: string): boolean {
  if (!data.features || !Array.isArray(data.features)) {
    return false;
  }
  
  // Check if all features have the expected geometry type
  return data.features.every(feature => 
    feature.geometry && 
    feature.geometry.type === expectedGeometryType
  );
} 