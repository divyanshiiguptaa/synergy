import React from 'react';
import { MapPin, Calendar, Building, Zap, DollarSign, User } from 'lucide-react';
import type { SpatialMatch } from '../utils/spatial';
import { formatDateRange, getFeatureProperty } from '../utils/spatial';
import PopupPanel from './PopupPanel';
import ContactCard from './ContactCard';

interface InfoPanelProps {
  selectedMatch: SpatialMatch | null;
  onClose: () => void;
  layerConfig?: any;
  showCost?: boolean;
  showManager?: boolean;
  showMatches?: boolean;
  title?: string;
}

function InfoPanel({ 
  selectedMatch, 
  onClose, 
  layerConfig,
  showCost = true,
  showManager = true,
  showMatches = true,
  title = "Project Details"
}: InfoPanelProps) {
  if (!selectedMatch) return null;

  const { referenceFeature } = selectedMatch;
  const properties = referenceFeature.properties;

  const getMatchInfo = () => {
    return {
      totalMatchCount: selectedMatch.totalMatchCount,
      targetMatches: selectedMatch.targetMatches
    };
  };

  const matchInfo = getMatchInfo();

  const renderInfoItem = (icon: React.ReactNode, label: string, value: string | number) => (
    <div className="flex items-start space-x-3">
      <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <PopupPanel title={title} onClose={onClose}>
      {/* Project Title */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {getFeatureProperty(referenceFeature, 'ProjectTitle', 'Untitled Project')}
        </h3>
      </div>

      {/* Project Info */}
      <div className="space-y-3">
        {/* Department/Agency */}
        {renderInfoItem(
          <Building className="w-5 h-5" />,
          "Agency",
          getFeatureProperty(referenceFeature, 'ProgramName', 'Unknown')
        )}

        {/* Date Range */}
        {renderInfoItem(
          <Calendar className="w-5 h-5" />,
          "Project Dates",
          formatDateRange(
            properties?.StartDate || properties?.ConsStartDate,
            properties?.EndDate || properties?.ConsEndDate
          )
        )}

        {/* Project Number */}
        {renderInfoItem(
          <MapPin className="w-5 h-5" />,
          "Project Number",
          getFeatureProperty(referenceFeature, 'ProjectNumber', 'N/A')
        )}

        {/* Construction Cost */}
        {showCost && properties?.ConstructionCost && (
          renderInfoItem(
            <DollarSign className="w-5 h-5" />,
            "Construction Cost",
            `$${properties.ConstructionCost.toLocaleString()}`
          )
        )}
      </div>

      {/* Matched Assets Section */}
      {showMatches && layerConfig && matchInfo.totalMatchCount > 0 && (
        <div className="border-t border-gray-200 pt-6">
          {/* Section Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900">
                Infrastructure Affected
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {matchInfo.totalMatchCount} item{matchInfo.totalMatchCount !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Infrastructure Breakdown */}
          <div className="space-y-3">
            {matchInfo.targetMatches.map((targetMatch, index) => {
              if (targetMatch.matchCount === 0) return null;
              const targetConfig = layerConfig.target[index];
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-900">
                      {targetConfig.name}
                    </h5>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {targetMatch.matchCount}
                    </span>
                  </div>
                  
                  {/* Grouped Breakdown */}
                  {Object.keys(targetMatch.groupedMatches).length > 0 && (
                    <div className="space-y-1.5">
                      {Object.entries(targetMatch.groupedMatches)
                        .filter(([group]) => group !== 'Unknown - Unknown')
                        .map(([group, count]) => (
                          <div key={group} className="flex justify-between items-center text-xs">
                            <span className="text-gray-600 truncate pr-2">{group}</span>
                            <span className="font-medium text-gray-900 min-w-[1.5rem] text-right">{count}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Project Manager Contact Card */}
      {showManager && properties?.PM_Name && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-5 h-5 text-gray-600" />
            <h4 className="text-sm font-medium text-gray-700">Contact</h4>
          </div>
          <ContactCard
            name={properties.PM_Name}
            phone={properties.PM_Phone}
            email={properties.PM_EMail}
            department={properties.ProgramName || "City of Los Angeles"}
            title="Project Manager"
          />
        </div>
      )}
    </PopupPanel>
  );
}

export default InfoPanel; 