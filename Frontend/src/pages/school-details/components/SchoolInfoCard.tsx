import { useEffect, useState } from 'react';
import { Globe, Mail, Phone } from 'lucide-react';
import api from '../../../lib/api';
import { InfoCardSkeleton } from '../../../components/skeletons/SchoolDetailsSkeleton';
import { SchoolDetail } from '../../../types/school';

interface SchoolInfoCardProps {
  schoolId?: string;
}

const INFO_COLORS = {
  website: { color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
  email: { color: '#C1572B', bg: 'rgba(193, 87, 43, 0.12)' },
  phone: { color: '#E8A93B', bg: 'rgba(232, 169, 59, 0.15)' },
};

function SchoolInfoCard({ schoolId }: SchoolInfoCardProps) {
  const [school, setSchool] = useState<SchoolDetail | null>(null);
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
          setSchool(response.data as SchoolDetail);
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
    ...(school.website ? [{
      icon: Globe,
      label: 'Website',
      value: school.website,
      color: INFO_COLORS.website.color,
      bg: INFO_COLORS.website.bg,
      isLink: true,
    }] : []),
    ...(school.contactEmail ? [{
      icon: Mail,
      label: 'Email',
      value: school.contactEmail,
      color: INFO_COLORS.email.color,
      bg: INFO_COLORS.email.bg,
      isLink: true,
    }] : []),
    ...(school.contactPhone ? [{
      icon: Phone,
      label: 'Phone',
      value: school.contactPhone,
      color: INFO_COLORS.phone.color,
      bg: INFO_COLORS.phone.bg,
      isLink: true,
    }] : []),
  ] : [];

  if (loading) {
    return <InfoCardSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
        Contact Information
      </h2>
      <div className="space-y-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.bg }}>
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{item.label}</p>
                {item.isLink && item.label === 'Website' ? (
                  <a
                    href={item.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base sm:text-lg font-bold hover:underline break-all"
                    style={{ color: '#1F5D45' }}
                  >
                    {item.value}
                  </a>
                ) : item.isLink && item.label === 'Email' ? (
                  <a
                    href={`mailto:${item.value}`}
                    className="text-base sm:text-lg font-bold hover:underline"
                    style={{ color: '#1F5D45' }}
                  >
                    {item.value}
                  </a>
                ) : item.isLink && item.label === 'Phone' ? (
                  <a
                    href={`tel:${item.value}`}
                    className="text-base sm:text-lg font-bold hover:underline"
                    style={{ color: '#1F5D45' }}
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
