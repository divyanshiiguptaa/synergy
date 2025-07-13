import { User, Phone, Mail, Building } from 'lucide-react';
import type { ReactNode, MouseEventHandler, ElementType } from 'react';

interface ContactCardProps {
  name: string;
  phone?: string;
  email?: string;
  department?: string;
  title?: string;
  icon?: ElementType;
  customFields?: ReactNode;
}

function ContactInfo({ phone, email }: { phone?: string; email?: string }) {
  function formatPhoneNumber(phone: string) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }
  function handlePhoneClick() {
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      window.open(`tel:${cleanPhone}`, '_self');
    }
  }
  function handleEmailClick() {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  }
  return (
    <div className="space-y-1">
      {phone && (
        <button
          onClick={handlePhoneClick}
          className="w-full flex items-center space-x-2 p-1.5 rounded-md hover:bg-blue-100 transition-colors group"
        >
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Phone className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-xs text-gray-700 group-hover:text-gray-900">
            {formatPhoneNumber(phone)}
          </span>
        </button>
      )}
      {email && (
        <button
          onClick={handleEmailClick}
          className="w-full flex items-center space-x-2 p-1.5 rounded-md hover:bg-blue-100 transition-colors group"
        >
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Mail className="w-3 h-3 text-blue-600" />
          </div>
          <span className="text-xs text-gray-700 group-hover:text-gray-900 truncate">
            {email}
          </span>
        </button>
      )}
    </div>
  );
}

function QuickActions() {
  return (
    <div className="mt-2 pt-2 border-t border-blue-200">
      <p className="text-xs text-gray-500 text-center">
        Click to contact directly
      </p>
    </div>
  );
}

export default function ContactCard({
  name,
  phone,
  email,
  department = "City of Los Angeles",
  title = "Project Manager",
  icon: Icon = User,
  customFields,
}: ContactCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-600">{title}</p>
        </div>
      </div>
      {/* Department */}
      <div className="flex items-center space-x-1 mb-2 text-xs text-gray-600">
        <Building className="w-3 h-3" />
        <span>{department}</span>
      </div>
      {/* Custom Fields */}
      {customFields}
      {/* Contact Info */}
      <ContactInfo phone={phone} email={email} />
      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
} 