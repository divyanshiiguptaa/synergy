import type { LucideIcon } from 'lucide-react';
import { MapPin, Calendar, Building, Zap, DollarSign, User } from 'lucide-react';
import type { SpatialMatch } from '../utils/spatial';
import { formatDateRange, getFeatureProperty } from '../utils/spatial';
import { DATA_CONSTANTS } from '../configs/constants';
import PopupPanel from './PopupPanel';
import ContactCard from './ContactCard';

export interface InfoPanelProps {
  selectedMatch: SpatialMatch | null;
  onClose: () => void;
  layerConfig?: any;
  showCost?: boolean;
  showManager?: boolean;
  showMatches?: boolean;
  title?: string;
  customFields?: CustomField[];
  contactConfig?: ContactConfig;
}

export interface CustomField {
  key: string;
  label: string;
  icon: LucideIcon;
  formatter?: (value: any) => string;
  condition?: (properties: any) => boolean;
}

export interface ContactConfig {
  nameKey: string;
  phoneKey: string;
  emailKey: string;
  departmentKey?: string;
  departmentFallback?: string;
  title?: string;
}

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start space-x-3">
    <div className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0 flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-900">{value}</p>
    </div>
  </div>
);

interface MatchesSectionProps {
  matchInfo: { totalMatchCount: number; targetMatches: any[] };
  layerConfig: any;
}

const MatchesSection = ({ matchInfo, layerConfig }: MatchesSectionProps) => (
  <div className="border-t border-gray-200 pt-6">
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
            
            {Object.keys(targetMatch.groupedMatches).length > 0 && (
              <div className="space-y-1.5">
                {Object.entries(targetMatch.groupedMatches)
                  .filter(([group]) => group !== 'Unknown - Unknown')
                  .map(([group, count]) => (
                    <div key={group} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 truncate pr-2">{group}</span>
                      <span className="font-medium text-gray-900 min-w-[1.5rem] text-right">{String(count)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

interface ContactSectionProps {
  properties: any;
  config: ContactConfig;
}

const ContactSection = ({ properties, config }: ContactSectionProps) => (
  <div className="border-t border-gray-200 pt-4">
    <div className="flex items-center space-x-2 mb-3">
      <User className="w-5 h-5 text-gray-600" />
      <h4 className="text-sm font-medium text-gray-700">Contact</h4>
    </div>
    <ContactCard
      name={properties[config.nameKey]}
      phone={properties[config.phoneKey]}
      email={properties[config.emailKey]}
      department={properties[config.departmentKey || 'ProgramName'] || config.departmentFallback}
      title={config.title || "Project Manager"}
    />
  </div>
);

const DEFAULT_CUSTOM_FIELDS: CustomField[] = [
  {
    key: 'ProgramName',
    label: 'Agency',
    icon: Building,
    formatter: (value) => value || DATA_CONSTANTS.DEFAULTS.UNKNOWN
  },
  {
    key: 'ProjectNumber',
    label: 'Project Number',
    icon: MapPin,
    formatter: (value) => value || DATA_CONSTANTS.DEFAULTS.N_A
  }
];

const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  nameKey: 'PM_Name',
  phoneKey: 'PM_Phone',
  emailKey: 'PM_EMail',
  departmentKey: 'ProgramName',
  departmentFallback: DATA_CONSTANTS.DEFAULTS.CITY_OF_LA,
  title: 'Project Manager'
};

export default function InfoPanel({ 
  selectedMatch, 
  onClose, 
  layerConfig,
  showCost = true,
  showManager = true,
  showMatches = true,
  title = "Project Details",
  customFields = DEFAULT_CUSTOM_FIELDS,
  contactConfig = DEFAULT_CONTACT_CONFIG
}: InfoPanelProps) {
  if (!selectedMatch) return null;

  const { referenceFeature } = selectedMatch;
  const properties = referenceFeature.properties;

  const matchInfo = {
    totalMatchCount: selectedMatch.totalMatchCount,
    targetMatches: selectedMatch.targetMatches
  };

  const renderCustomFields = () => {
    const dateField = (
      <InfoItem
        icon={Calendar}
        label="Project Dates"
        value={formatDateRange(
          properties?.StartDate || properties?.ConsStartDate,
          properties?.EndDate || properties?.ConsEndDate
        )}
      />
    );

    const costField = showCost && properties?.ConstructionCost && (
      <InfoItem
        icon={DollarSign}
        label="Construction Cost"
        value={`$${properties.ConstructionCost.toLocaleString()}`}
      />
    );

    const customFieldItems = customFields.map(field => {
      if (field.condition && !field.condition(properties)) return null;
      
      const value = getFeatureProperty(referenceFeature, field.key, '');
      const formattedValue = field.formatter ? field.formatter(value) : String(value || '');
      
      return (
        <InfoItem
          key={field.key}
          icon={field.icon}
          label={field.label}
          value={formattedValue}
        />
      );
    });

    return [dateField, costField, ...customFieldItems].filter(Boolean);
  };

  return (
    <PopupPanel title={title} onClose={onClose}>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {getFeatureProperty(referenceFeature, 'ProjectTitle', 'Untitled Project')}
        </h3>
      </div>

      <div className="space-y-3">
        {renderCustomFields()}
      </div>

      {showMatches && layerConfig && matchInfo.totalMatchCount > 0 && (
        <MatchesSection matchInfo={matchInfo} layerConfig={layerConfig} />
      )}

      {showManager && properties?.[contactConfig.nameKey] && (
        <ContactSection properties={properties} config={contactConfig} />
      )}
    </PopupPanel>
  );
} 