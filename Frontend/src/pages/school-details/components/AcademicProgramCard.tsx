import { Monitor, BookOpen, Check, Baby, Users, FlaskConical, Library, Dumbbell, Utensils, BedDouble } from 'lucide-react';
import type { SchoolDetail } from '../../../types/school';
import { ProgramCardSkeleton } from '../../../components/skeletons/SchoolDetailsSkeleton';

interface AcademicProgramCardProps {
  school: SchoolDetail | null;
  loading: boolean;
}

const STREAM_COLORS: Record<string, Record<string, string>> = {
  General: { color: '#1F5D45', backgroundColor: 'rgba(31, 93, 69, 0.12)', borderColor: 'rgba(31, 93, 69, 0.3)' },
  Technical: { color: '#C1572B', backgroundColor: 'rgba(193, 87, 43, 0.12)', borderColor: 'rgba(193, 87, 43, 0.3)' },
  Commercial: { color: '#E8A93B', backgroundColor: 'rgba(232, 169, 59, 0.15)', borderColor: 'rgba(232, 169, 59, 0.4)' },
};

// Facilities checklist per category
const FACILITIES: Record<string, { icon: any; label: string; color: string; bg: string }[]> = {
  PrimaryNursery: [
    { icon: Baby, label: 'Playground', color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
    { icon: Utensils, label: 'Meal Program', color: '#C1572B', bg: 'rgba(193, 87, 43, 0.12)' },
    { icon: BedDouble, label: 'Nap Area', color: '#E8A93B', bg: 'rgba(232, 169, 59, 0.15)' },
    { icon: BookOpen, label: 'Library', color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
  ],
  Secondary: [
    { icon: FlaskConical, label: 'Science Lab', color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
    { icon: Library, label: 'Library', color: '#C1572B', bg: 'rgba(193, 87, 43, 0.12)' },
    { icon: Dumbbell, label: 'Sports Field', color: '#E8A93B', bg: 'rgba(232, 169, 59, 0.15)' },
    { icon: Monitor, label: 'Computer Lab', color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
  ],
  University: [
    { icon: Library, label: 'Central Library', color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
    { icon: FlaskConical, label: 'Research Labs', color: '#C1572B', bg: 'rgba(193, 87, 43, 0.12)' },
    { icon: Monitor, label: 'ICT Center', color: '#E8A93B', bg: 'rgba(232, 169, 59, 0.15)' },
    { icon: Users, label: 'Student Housing', color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
  ],
};

function FacilitiesChecklist({ category }: { category: string }) {
  const facilities = FACILITIES[category] || FACILITIES.Secondary;
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      {facilities.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: feature.bg }}>
              <Icon className="w-4 h-4" style={{ color: feature.color }} />
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">{feature.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function SpecializationList({ title, programs }: { title: string; programs: any[] }) {
  if (programs.length === 0) return null;
  return (
    <div className="mt-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-2.5">{title}</h3>
      <div className="space-y-2">
        {programs.map((program) => (
          <div key={program.id || program.name} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100">
            <Check className="w-4 h-4 flex-shrink-0" style={{ color: '#1F5D45' }} />
            <span className="text-sm text-gray-700">{program.name}</span>
            {program.duration && (
              <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{program.duration}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SecondaryAcademics({ school }: { school: SchoolDetail }) {
  const streams = school.secondaryStreams?.length ? school.secondaryStreams : ['General'];
  const programs = school.programs || [];
  const technicalPrograms = programs.filter((p) => p.level === 'Technical');
  const commercialPrograms = programs.filter((p) => p.level === 'Commercial');
  const classesOffered = school.classesOffered?.length
    ? school.classesOffered
    : ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'];

  return (
    <div>
      <div className="p-4 rounded-lg border border-gray-100 mb-4" style={{ backgroundColor: 'rgba(31, 93, 69, 0.04)' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Curriculum</h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {school.curriculum ? `${school.curriculum} curriculum` : 'Bilingual curriculum (English/French)'} aligned with the Ministry of Secondary Education (MINESEC).
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          {classesOffered.join(' · ')} with a strong focus on GCE O-Level and A-Level preparation.
        </p>
      </div>

      {school.offersHighSchool && (
        <div className="p-4 rounded-lg border border-gray-100 mb-4" style={{ backgroundColor: 'rgba(193, 87, 43, 0.04)' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">A-Level Subject Combinations</h3>
          {school.highSchoolPrograms ? (
            <p className="text-xs sm:text-sm text-gray-600">{school.highSchoolPrograms}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={STREAM_COLORS.General}>Sciences</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={STREAM_COLORS.Technical}>Arts</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={STREAM_COLORS.Commercial}>Economics</span>
            </div>
          )}
        </div>
      )}

      {streams.length > 1 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Streams Offered</h3>
          <div className="flex flex-wrap gap-2">
            {streams.map((s) => {
              const style = STREAM_COLORS[s] || { color: '#334155', backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' };
              return (
                <span
                  key={s}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                  style={style}
                >
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <SpecializationList title="Technical Specializations" programs={technicalPrograms} />
      <SpecializationList title="Commercial Specializations" programs={commercialPrograms} />

      <FacilitiesChecklist category="Secondary" />
    </div>
  );
}

function PrimaryNurseryAcademics({ school }: { school: SchoolDetail }) {
  return (
    <div>
      <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">About This School</h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {school.description || 'No description available.'}
        </p>
      </div>
      <div className="p-4 rounded-lg border border-gray-100 mb-4" style={{ backgroundColor: 'rgba(31, 93, 69, 0.04)' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Age Range & Class Size</h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {school.ageRange ? `Ages ${school.ageRange}` : 'Ages 3–12'} · {school.studentTeacherRatio ? `Student-teacher ratio ${school.studentTeacherRatio}` : 'Small class sizes for individualized attention.'}
        </p>
      </div>
      <div className="p-4 rounded-lg border border-gray-100 mb-4" style={{ backgroundColor: 'rgba(31, 93, 69, 0.04)' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Curriculum</h3>
        <p className="text-xs sm:text-sm text-gray-600">
          {school.curriculum ? `${school.curriculum} curriculum` : 'Play-based early learning approach aligned with the national primary curriculum.'}
        </p>
      </div>
      <FacilitiesChecklist category="PrimaryNursery" />
    </div>
  );
}

function UniversityAbout({ school }: { school: SchoolDetail }) {
  return (
    <div>
      <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50 mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">About This University</h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {school.description || 'No description available.'}
        </p>
      </div>
      <FacilitiesChecklist category="University" />
    </div>
  );
}

function AcademicProgramCard({ school, loading }: AcademicProgramCardProps) {
  if (loading || !school) {
    if (loading) {
      return <ProgramCardSkeleton />;
    }
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Academic Programs</h2>
        {school?.programs?.length === 0 && (
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
            No programs available for this school.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        {school.category === 'PrimaryNursery' && 'About This School'}
        {school.category === 'Secondary' && 'Academic Program'}
        {school.category === 'University' && 'About This University'}
      </h2>

      {school.category === 'PrimaryNursery' && <PrimaryNurseryAcademics school={school} />}
      {school.category === 'Secondary' && <SecondaryAcademics school={school} />}
      {school.category === 'University' && <UniversityAbout school={school} />}
    </div>
  );
}

export default AcademicProgramCard;