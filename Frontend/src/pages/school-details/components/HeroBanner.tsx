import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import SmartImage from '../../../components/skeletons/SmartImage';
import { HeroSkeleton } from '../../../components/skeletons/SchoolDetailsSkeleton';
import { useSchool } from '../context/SchoolContext';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

function HeroBanner() {
  const { t } = useTranslation();
  const { school, error, loading } = useSchool();

  if (loading) {
    return <HeroSkeleton />;
  }

  if (error) {
    return (
      <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[400px] overflow-hidden bg-red-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </section>
    );
  }

  const fallbackLetter = (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: '#1F5D45' }}
    >
      <span className="text-white text-8xl sm:text-9xl font-bold" style={{ fontFamily: 'Fraunces, serif' }}>
        {(school?.name || 'L').charAt(0).toUpperCase()}
      </span>
    </div>
  );

  return (
    <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[400px] overflow-hidden">
      
      {school?.imageUrl ? (
        <SmartImage
          src={school.imageUrl}
          alt={school.name || 'School'}
          containerClassName="absolute inset-0"
          fallbackSrc={DEFAULT_SCHOOL_IMAGE}
          fallback={fallbackLetter}
        />
      ) : (
        fallbackLetter
      )}
      
      
      <div className="absolute inset-0 hero-gradient" />

      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
       
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {school?.category || 'School'}
          </span>
          {school?.offersHighSchool && (
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
              Offers High School
            </span>
          )}
          {school?.programs && school.programs.length > 0 && (
            <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
              {school.programs.length} {t("schoolDetails.programs")}
            </span>
          )}
        </div>

        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
          {school?.name || t("schoolDetails.notFound")}
        </h1>

        
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          <span className="text-base sm:text-lg md:text-xl font-medium">
            {school?.city}, {school?.region}
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
