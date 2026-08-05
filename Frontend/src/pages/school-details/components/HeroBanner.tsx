import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../lib/api';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

interface HeroBannerProps {
  schoolId?: string;
}

interface School {
  id: string;
  name: string;
  city: string;
  region: string;
  category: string;
  imageUrl?: string;
  programs?: any[];
}

function HeroBanner({ schoolId }: HeroBannerProps) {
  const { t } = useTranslation();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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

  if (loading) {
    return (
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[400px] overflow-hidden bg-gray-200 flex items-center justify-center">
        <div className="text-white">{t("common.loading")}</div>
      </section>
    );
  }

  const showHeroImage = school?.imageUrl && !imageError;

  return (
    <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[400px] overflow-hidden">
      
      {showHeroImage ? (
        <img
          src={school?.imageUrl}
          alt={school?.name || 'School'}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: '#1F5D45' }}
        >
          <span className="text-white text-8xl sm:text-9xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
            {(school?.name || 'L').charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      
      <div className="absolute inset-0 hero-gradient" />

      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
       
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {school?.category || 'School'}
          </span>
          {school?.programs && school.programs.length > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
              {school.programs.length} {t("schoolDetails.programs")}
            </span>
          )}
        </div>

        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
          {school?.name || t("schoolDetails.notFound")}
        </h1>

        
        <div className="text-white/90">
          <span className="text-base sm:text-lg md:text-xl font-medium">
            {school?.city}, {school?.region}
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;