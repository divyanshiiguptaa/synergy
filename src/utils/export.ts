import type { SpatialMatch } from './spatial';
import type { LayerConfig } from '../configs/layerConfig';

export interface ExportOptions {
  includeContactInfo?: boolean;
  includeInfrastructureImpact?: boolean;
  includeCostData?: boolean;
  format?: 'csv' | 'excel';
  layerConfig?: LayerConfig;
}

/**
 * Export spatial analysis results to CSV format for city managers
 * Includes project details, contact information, and infrastructure impact
 */
export function exportToCSV(
  spatialResults: SpatialMatch[],
  options: ExportOptions = {}
): void {
  const {
    includeContactInfo = true,
    includeInfrastructureImpact = true,
    includeCostData = true,
    layerConfig
  } = options;

  // Prepare CSV data
  const csvData: string[][] = [];
  
  // Add headers
  const headers = [
    'Project Title',
    'Project Number',
    'Agency/Department',
    'Start Date',
    'End Date'
  ];

  if (includeCostData) {
    headers.push('Construction Cost ($)');
  }

  if (includeContactInfo) {
    headers.push('Project Manager');
    headers.push('Phone');
    headers.push('Email');
  }

  if (includeInfrastructureImpact) {
    headers.push('Total Infrastructure Items Affected');
    headers.push('Infrastructure Breakdown');
  }

  csvData.push(headers);

  // Add data rows
  spatialResults.forEach(match => {
    const { referenceFeature } = match;
    const properties = referenceFeature.properties;

    const row = [
      properties?.ProjectTitle || 'Untitled Project',
      properties?.ProjectNumber || 'N/A',
      properties?.ProgramName || 'Unknown',
      properties?.StartDate ? new Date(properties.StartDate).toLocaleDateString() : 'N/A',
      properties?.EndDate ? new Date(properties.EndDate).toLocaleDateString() : 'N/A'
    ];

    if (includeCostData) {
      row.push(properties?.ConstructionCost ? `$${properties.ConstructionCost.toLocaleString()}` : 'N/A');
    }

    if (includeContactInfo) {
      row.push(properties?.PM_Name || 'N/A');
      row.push(properties?.PM_Phone || 'N/A');
      row.push(properties?.PM_EMail || 'N/A');
    }

    if (includeInfrastructureImpact) {
      row.push(match.totalMatchCount.toString());
      
      // Create infrastructure breakdown string
      const breakdown = match.targetMatches
        .filter(targetMatch => targetMatch.matchCount > 0)
        .map((targetMatch, index) => {
          const targetName = layerConfig?.target[index]?.name || `Target ${index + 1}`;
          const groups = Object.entries(targetMatch.groupedMatches)
            .map(([group, count]) => {
              // Replace "Unknown - Unknown" with proper target name
              if (group === 'Unknown - Unknown') {
                return `${targetName}: ${count}`;
              }
              return `${group}: ${count}`;
            })
            .join('; ');
          return groups;
        })
        .join(' | ');
      
      row.push(breakdown || 'None');
    }

    csvData.push(row);
  });

  // Convert to CSV string
  const csvContent = csvData
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `project-analysis-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export project manager contact information to CSV
 */
export function exportContactList(spatialResults: SpatialMatch[]): void {
  const csvData: string[][] = [];
  
  // Headers
  csvData.push([
    'Project Manager',
    'Phone',
    'Email',
    'Department',
    'Project Title',
    'Project Number'
  ]);

  // Filter unique project managers
  const uniqueManagers = new Map();
  
  spatialResults.forEach(match => {
    const { referenceFeature } = match;
    const properties = referenceFeature.properties;
    
    if (properties?.PM_Name && properties?.PM_EMail) {
      const key = `${properties.PM_Name}-${properties.PM_EMail}`;
      if (!uniqueManagers.has(key)) {
        uniqueManagers.set(key, {
          name: properties.PM_Name,
          phone: properties.PM_Phone || 'N/A',
          email: properties.PM_EMail,
          department: properties.ProgramName || 'Unknown',
          projectTitle: properties.ProjectTitle || 'Untitled Project',
          projectNumber: properties.ProjectNumber || 'N/A'
        });
      }
    }
  });

  // Add data rows
  uniqueManagers.forEach(manager => {
    csvData.push([
      manager.name,
      manager.phone,
      manager.email,
      manager.department,
      manager.projectTitle,
      manager.projectNumber
    ]);
  });

  // Convert to CSV and download
  const csvContent = csvData
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `project-managers-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export infrastructure impact summary
 */
export function exportInfrastructureSummary(
  spatialResults: SpatialMatch[],
  layerConfig?: LayerConfig
): void {
  const csvData: string[][] = [];
  
  // Headers
  csvData.push([
    'Infrastructure Type',
    'Subcategory',
    'Count',
    'Affected Projects'
  ]);

  // Aggregate infrastructure impact
  const infrastructureSummary = new Map();
  
  spatialResults.forEach(match => {
    const { referenceFeature } = match;
    const projectTitle = referenceFeature.properties?.ProjectTitle || 'Untitled Project';
    
    match.targetMatches.forEach(targetMatch => {
      Object.entries(targetMatch.groupedMatches).forEach(([group, count]) => {
        if (!infrastructureSummary.has(group)) {
          infrastructureSummary.set(group, {
            count: 0,
            projects: new Set()
          });
        }
        
        const summary = infrastructureSummary.get(group);
        summary.count += count;
        summary.projects.add(projectTitle);
      });
    });
  });

  // Add data rows
  infrastructureSummary.forEach((summary, group) => {
    let [type, subcategory] = group.split(' - ');
    
    // Replace "Unknown - Unknown" with proper target names
    if (type === 'Unknown' && subcategory === 'Unknown') {
      // Find which target this group belongs to by checking all spatial results
      let targetIndex = -1;
      for (const match of spatialResults) {
        const foundIndex = match.targetMatches.findIndex(targetMatch => 
          Object.keys(targetMatch.groupedMatches).includes(group)
        );
        if (foundIndex !== -1) {
          targetIndex = foundIndex;
          break;
        }
      }
      
      if (targetIndex !== -1 && layerConfig?.target[targetIndex]) {
        type = layerConfig.target[targetIndex].name;
        subcategory = 'All Types';
      }
    }
    
    csvData.push([
      type || 'Unknown',
      subcategory || 'Unknown',
      summary.count.toString(),
      Array.from(summary.projects).join('; ')
    ]);
  });

  // Convert to CSV and download
  const csvContent = csvData
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `infrastructure-impact-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 