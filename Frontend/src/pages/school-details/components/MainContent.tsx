import React from 'react';
import FeeCard from './FeeCard';
import AcademicProgramCard from './AcademicProgramCard';
import MapCard from './MapCard';
import SchoolInfoCard from './SchoolInfoCard';

interface MainContentProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  schoolId?: string;
}

function MainContent({ mapRef, schoolId }: MainContentProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        <div className="space-y-6 sm:space-y-8">
          <FeeCard schoolId={schoolId} />
          <AcademicProgramCard schoolId={schoolId} />
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