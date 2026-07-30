import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';

interface HeroBannerProps {
  schoolId?: string;
}

interface Institution {
  id: string;
  name: string;
  city: string;
  region: string;
  type: string;
  imageUrl?: string;
  programs?: any[];
}

function HeroBanner({ schoolId }: HeroBannerProps) {
  const [school, setSchool] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadSchool = async () => {
      try {
        const response = await api.getInstitution(schoolId);
        if (!response.error && response.data) {
          setSchool(response.data);
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
        <div className="text-white">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[400px] overflow-hidden">
      
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${school?.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'}')`,
        }}
      />
      
      
      <div className="absolute inset-0 hero-gradient" />

      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
       
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {school?.type || 'School'}
          </span>
          {school?.programs && school.programs.length > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
              {school.programs.length} Programs
            </span>
          )}
        </div>

        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
          {school?.name || "School Details"}
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