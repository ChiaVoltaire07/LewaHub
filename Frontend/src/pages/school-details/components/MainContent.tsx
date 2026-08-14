import { useEffect, useState } from 'react';
import FeeCard from './FeeCard';
import AcademicProgramCard from './AcademicProgramCard';
import MapCard from './MapCard';
import SchoolInfoCard from './SchoolInfoCard';
import api from '../../../lib/api';
import SmartImage from '../../../components/skeletons/SmartImage';
import { SchoolDetail } from '../../../types/school';
import type { RefObject } from 'react';

interface MainContentProps {
  mapRef: RefObject<HTMLDivElement>;
  schoolId?: string;
}

function MainContent({ mapRef, schoolId }: MainContentProps) {
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
                    <div className="h-40 sm:h-48">
                      <SmartImage
                        src={img.url}
                        alt={img.caption ?? school.name}
                        loading="lazy"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center bg-gray-100">
                            <span className="text-sm text-gray-400">Image unavailable</span>
                          </div>
                        }
                      />
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