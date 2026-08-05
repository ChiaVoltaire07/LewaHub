import React, { useEffect, useState } from 'react';
import FeeCard from './FeeCard';
import AcademicProgramCard from './AcademicProgramCard';
import MapCard from './MapCard';
import SchoolInfoCard from './SchoolInfoCard';
import api from '../../../lib/api';

interface MainContentProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  schoolId?: string;
}

export interface School {
  id: string;
  name: string;
  category: string;
  offersHighSchool: boolean;
  secondaryStreams?: string[];
  description?: string;
  city: string;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  website?: string;
  imageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  verified?: boolean;
  aiSummary?: string;
  anonymousViews?: number;
  programs?: any[];
  images?: { id: string; url: string; caption?: string; order: number }[];
}

function MainContent({ mapRef, schoolId }: MainContentProps) {
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
        console.error('Failed to load school details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchool();
  }, [schoolId]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-6 sm:space-y-8">
          <FeeCard school={school} loading={loading} />
          <AcademicProgramCard school={school} loading={loading} />
          {school?.images && school.images.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Campus & Facilities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {school.images.map((img) => (
                  <figure key={img.id} className="overflow-hidden rounded-lg border border-gray-100">
                    <img
                      src={img.url}
                      alt={img.caption ?? school.name}
                      loading="lazy"
                      className="w-full h-40 sm:h-48 object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Image unavailable</span>
                    </div>
                    {img.caption && (
                      <figcaption className="px-3 py-2 text-xs text-gray-600 bg-gray-50">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
          <MapCard mapRef={mapRef} schoolId={schoolId} />
          <SchoolInfoCard schoolId={schoolId} />
        </div>
      </div>
    </section>
  );
}

export default MainContent;