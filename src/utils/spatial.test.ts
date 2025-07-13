import { describe, it, expect } from 'vitest';
import { findSpatialMatches, getFeatureProperty, formatDate, formatDateRange } from './spatial';

describe('spatial.ts', () => {
  describe('findSpatialMatches', () => {
    it('should find spatial matches between reference and target features', () => {
      // Create a simple polygon reference feature
      const referenceFeatures = [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0]
            ]]
          },
          properties: {
            OBJECTID: 1,
            ProjectTitle: 'Test Project'
          }
        }
      ];

      // Create target point features - one inside, one outside the polygon
      const targetDatasets = [
        [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [0.5, 0.5] // Inside the polygon
            },
            properties: {
              Type: 'EV Charger',
              Status: 'Active'
            }
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [2, 2] // Outside the polygon
            },
            properties: {
              Type: 'EV Charger',
              Status: 'Inactive'
            }
          }
        ]
      ];

      const targetConfigs = [
        {
          groupByFields: ['Type', 'Status']
        }
      ];

      const result = findSpatialMatches(referenceFeatures, targetDatasets, targetConfigs);

      // Verify the results
      expect(result.matches).toHaveLength(1);
      expect(result.totalMatches).toBe(1);
      expect(result.summary).toEqual({
        'EV Charger - Active': 1
      });

      const match = result.matches[0];
      expect(match.referenceFeature).toBe(referenceFeatures[0]);
      expect(match.totalMatchCount).toBe(1);
      expect(match.targetMatches).toHaveLength(1);
      expect(match.targetMatches[0].matchCount).toBe(1);
      expect(match.targetMatches[0].groupedMatches).toEqual({
        'EV Charger - Active': 1
      });
    });

    it('should return empty results when no matches are found', () => {
      const referenceFeatures = [
        {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0]
            ]]
          },
          properties: {
            OBJECTID: 1
          }
        }
      ];

      const targetDatasets = [
        [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [2, 2] // Outside the polygon
            },
            properties: {
              Type: 'EV Charger'
            }
          }
        ]
      ];

      const targetConfigs = [
        {
          groupByFields: ['Type']
        }
      ];

      const result = findSpatialMatches(referenceFeatures, targetDatasets, targetConfigs);

      expect(result.matches).toHaveLength(0);
      expect(result.totalMatches).toBe(0);
      expect(result.summary).toEqual({});
    });
  });

  describe('getFeatureProperty', () => {
    it('should return property value when it exists', () => {
      const feature = {
        properties: {
          name: 'Test Feature',
          value: 123
        }
      };

      expect(getFeatureProperty(feature, 'name')).toBe('Test Feature');
      expect(getFeatureProperty(feature, 'value')).toBe(123);
    });

    it('should return fallback when property does not exist', () => {
      const feature = {
        properties: {
          name: 'Test Feature'
        }
      };

      expect(getFeatureProperty(feature, 'nonexistent')).toBe('Unknown');
      expect(getFeatureProperty(feature, 'nonexistent', 'Custom Fallback')).toBe('Custom Fallback');
    });
  });

  describe('formatDate', () => {
    it('should format timestamp to readable date', () => {
      const timestamp = 1640995200000; // January 1, 2022
      const formatted = formatDate(timestamp);
      expect(formatted).toMatch(/Jan.*1.*2022/);
    });

    it('should return unknown for invalid timestamp', () => {
      expect(formatDate(0)).toBe('Unknown');
      expect(formatDate(null as any)).toBe('Unknown');
    });
  });

  describe('formatDateRange', () => {
    it('should format date range correctly', () => {
      const startDate = 1640995200000; // January 1, 2022
      const endDate = 1643673600000; // January 31, 2022
      const formatted = formatDateRange(startDate, endDate);
      expect(formatted).toMatch(/Jan.*1.*2022.*–.*Feb.*1.*2022/);
    });
  });
}); 