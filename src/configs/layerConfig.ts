export interface ReferenceLayer {
  name: string;
  file: string;
  geometryType: 'Point' | 'LineString' | 'Polygon';
  filterFields: string[];
  color: string;
  fillColor?: string;
  fillOpacity?: number;
  displayFields: {
    title: string;
    department: string;
    startDate: string;
    endDate: string;
    projectNumber: string;
    cost: string;
  };
}

export interface TargetLayer {
  name: string;
  file: string;
  geometryType: 'Point' | 'LineString' | 'Polygon';
  groupByFields: string[];
  color: string;
  size?: number;
  displayFields: {
    type: string;
    status: string;
  };
}

export interface LayerConfig {
  reference: ReferenceLayer;
  target: TargetLayer[];
}

import { COLORS, DATA_CONSTANTS, MAP_CONSTANTS } from './constants';

export const defaultLayerConfig: LayerConfig = {
  reference: {
    name: 'CIP Projects',
    file: DATA_CONSTANTS.PATHS.CIP_PROJECTS,
    geometryType: 'Polygon',
    filterFields: ['department', 'start_date', 'end_date'],
    color: COLORS.PRIMARY.BLUE,
    fillColor: COLORS.PRIMARY.BLUE,
    fillOpacity: MAP_CONSTANTS.DEFAULT_FILL_OPACITY,
    displayFields: {
      title: 'ProjectTitle',
      department: 'ProgramName',
      startDate: 'StartDate',
      endDate: 'EndDate',
      projectNumber: 'ProjectNumber',
      cost: 'ConstructionCost'
    }
  },
  target: [{
    name: 'EV Chargers',
    file: DATA_CONSTANTS.PATHS.EV_CHARGERS,
    geometryType: 'Point',
    groupByFields: ['type', 'status'],
    color: COLORS.PRIMARY.GREEN,
    size: MAP_CONSTANTS.POINT_SIZE,
    displayFields: {
      type: 'type',
      status: 'status'
    }
  }]
};