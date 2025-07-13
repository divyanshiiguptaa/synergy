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

export const defaultLayerConfig: LayerConfig = {
  reference: {
    name: 'CIP Projects',
    file: '/data/cip_projects.json',
    geometryType: 'Polygon',
    filterFields: ['department', 'start_date', 'end_date'],
    color: '#3B82F6',
    fillColor: '#3B82F6',
    fillOpacity: 0.1,
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
    file: '/data/ev_chargers.json',
    geometryType: 'Point',
    groupByFields: ['type', 'status'],
    color: '#10B981',
    size: 6,
    displayFields: {
      type: 'type',
      status: 'status'
    }
  }]
};