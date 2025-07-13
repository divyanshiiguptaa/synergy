import * as turf from '@turf/turf';

export interface TargetMatch {
  targetFeatures: any[];
  matchCount: number;
  groupedMatches: Record<string, number>;
}

export interface SpatialMatch {
  referenceFeature: any;
  targetMatches: TargetMatch[];
  totalMatchCount: number;
}

export interface SpatialAnalysisResult {
  matches: SpatialMatch[];
  totalMatches: number;
  summary: Record<string, number>;
}

/**
 * Spatial analysis function that finds target features within reference features
 * Supports both single and multiple target datasets
 * @param referenceFeatures - Array of reference GeoJSON features (e.g., CIP projects)
 * @param targetDatasets - Array of target datasets (can be single or multiple)
 * @param targetConfigs - Array of target configurations
 * @returns SpatialAnalysisResult with matches and summary
 */
export function findSpatialMatches(
  referenceFeatures: any[],
  targetDatasets: any[][],
  targetConfigs: Array<{ groupByFields: string[] }>
): SpatialAnalysisResult {
  const matches: SpatialMatch[] = [];
  let totalMatches = 0;
  const summary: Record<string, number> = {};

  for (const referenceFeature of referenceFeatures) {
    const targetMatches: TargetMatch[] = [];
    let hasAnyMatches = false;

    // Analyze each target type
    for (let i = 0; i < targetDatasets.length; i++) {
      const targetFeatures = targetDatasets[i] || [];
      const targetConfig = targetConfigs[i];
      const targetMatchesForType: any[] = [];
      const groupedMatches: Record<string, number> = {};

      for (const targetFeature of targetFeatures) {
        try {
          if (turf.booleanPointInPolygon(targetFeature, referenceFeature)) {
            targetMatchesForType.push(targetFeature);
          }
        } catch (error) {
          console.warn('Spatial analysis error:', error);
          continue;
        }
      }

      if (targetMatchesForType.length > 0) {
        hasAnyMatches = true;
        
        // Group matches by specified fields
        for (const match of targetMatchesForType) {
          const groupKey = targetConfig.groupByFields
            .map(field => match.properties?.[field] || 'Unknown')
            .join(' - ');
          
          groupedMatches[groupKey] = (groupedMatches[groupKey] || 0) + 1;
          summary[groupKey] = (summary[groupKey] || 0) + 1;
        }

        targetMatches.push({
          targetFeatures: targetMatchesForType,
          matchCount: targetMatchesForType.length,
          groupedMatches
        });

        totalMatches += targetMatchesForType.length;
      } else {
        targetMatches.push({
          targetFeatures: [],
          matchCount: 0,
          groupedMatches: {}
        });
      }
    }

    if (hasAnyMatches) {
      matches.push({
        referenceFeature,
        targetMatches,
        totalMatchCount: targetMatches.reduce((sum, match) => sum + match.matchCount, 0)
      });
    }
  }

  return {
    matches,
    totalMatches,
    summary
  };
}

/**
 * Get feature properties safely
 * @param feature - GeoJSON feature
 * @param property - Property name
 * @param fallback - Fallback value
 * @returns Property value or fallback
 */
export function getFeatureProperty(feature: any, property: string, fallback: string = 'Unknown'): string {
  return feature?.properties?.[property] || fallback;
}

/**
 * Format date from timestamp to readable string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date string
 */
export function formatDate(timestamp: number): string {
  if (!timestamp) return 'Unknown';
  
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date range for display
 * @param startDate - Start date timestamp
 * @param endDate - End date timestamp
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: number, endDate: number): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} – ${end}`;
} 