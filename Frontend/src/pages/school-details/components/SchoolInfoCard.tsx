import React, { useEffect, useState } from 'react';
import { Globe, Mail, Phone } from 'lucide-react';
import api from '../../../lib/api';

interface SchoolInfoCardProps {
  schoolId?: string;
}

interface School {
  name: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  verified?: boolean;
}

function SchoolInfoCard({ schoolId }: SchoolInfoCardProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadSchool = async () => {
      try {
        const response = await api.getSchool(schoolId);
        if (!response.error && response.data) {
          setSchool(response.data as School);
        }
      } catch (err) {
        console.error('Failed to load school info:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchool();
  }, [schoolId]);

  const infoItems = school ? [
    {
      icon: Globe,
      label: 'Website',
      value: school.website || 'Not provided',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      isLink: !!school.website,
    },
    {
      icon: Mail,
      label: 'Email',
      value: school.contactEmail || 'Not provided',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      isLink: !!school.contactEmail,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: school.contactPhone || 'Not provided',
      color: 'text-primary-700',
      bg: 'bg-primary-50',
      isLink: !!school.contactPhone,
    },
  ] : [];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
        {loading ? 'Loading Info...' : 'Contact Information'}
      </h2>
      <div className="space-y-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
            >
              <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{item.label}</p>
                {item.isLink && item.label === 'Website' ? (
                  <a
                    href={item.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-bold text-blue-600 hover:underline break-all"
                  >
                    {item.value}
                  </a>
                ) : item.isLink && item.label === 'Email' ? (
                  <a
                    href={`mailto:${item.value}`}
                    className="text-base sm:text-lg font-bold text-blue-600 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : item.isLink && item.label === 'Phone' ? (
                  <a
                    href={`tel:${item.value}`}
                    className="text-base sm:text-lg font-bold text-blue-600 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-base sm:text-lg font-bold text-gray-900">{item.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SchoolInfoCard;
