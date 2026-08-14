import { GraduationCap, BookOpen, School as SchoolIcon, Info } from 'lucide-react';
import type { SchoolDetail } from '../../../types/school';
import { FeeCardSkeleton } from '../../../components/skeletons/SchoolDetailsSkeleton';

interface FeeCardProps {
  school: SchoolDetail | null;
  loading: boolean;
}

function FeeCard({ school, loading }: FeeCardProps) {
  if (loading) {
    return <FeeCardSkeleton />;
  }

  // === PRIMARY / NURSERY: single Annual Fee row ===
  if (school?.category === 'PrimaryNursery') {
    const annualFee = school.annualFee
      ? `${school.annualFee.toLocaleString()} XAF / Year`
      : 'N/A';

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Fraunces, serif' }}>Fees</h2>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(31, 93, 69, 0.12)' }}>
                <GraduationCap className="w-5 h-5" style={{ color: '#1F5D45' }} />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-700 block">
                Annual Fee
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {annualFee}
            </span>
          </div>
        </div>
        <div className="border-t px-5 sm:px-6 py-3 sm:py-4" style={{ backgroundColor: 'rgba(232, 169, 59, 0.08)', borderColor: 'rgba(232, 169, 59, 0.2)' }}>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A93B' }} />
            <p className="text-xs sm:text-sm" style={{ color: '#8a6d1f' }}>
              <strong>Note:</strong> Fees shown are tuition costs. Additional fees for materials, uniforms, and services may apply.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === SECONDARY: Fee Structure card ===
  if (school?.category === 'Secondary') {
    const programs = school.programs || [];
    // Form 1–5 row: prefer an O'Level / general secondary program, fall back to any Secondary-level program
    const secondaryProgram =
      programs.find((p) => p.level === 'Secondary' && /o'?level|form|secondary/i.test(p.name)) ||
      programs.find((p) => p.level === 'Secondary');
    const secondaryFee = secondaryProgram?.tuition
      ? `${secondaryProgram.tuition.toLocaleString()} XAF / Year`
      : '550,000 XAF / Year';

    // High School row: the Advanced Level / A-Level program
    const highSchoolProgram = programs.find((p) => p.level === 'Secondary' && /advanced|a-?level|high school|sixth/i.test(p.name));
    const highSchoolFee = highSchoolProgram?.tuition
      ? `${highSchoolProgram.tuition.toLocaleString()} XAF / Year`
      : '750,000 XAF / Year';

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Fraunces, serif' }}>Fee Structure</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(31, 93, 69, 0.12)' }}>
                  <BookOpen className="w-5 h-5" style={{ color: '#1F5D45' }} />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-medium text-gray-700 block">Secondary (Form 1–5)</span>
                </div>
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                {secondaryFee}
              </span>
            </div>

            {school.offersHighSchool && (
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(193, 87, 43, 0.12)' }}>
                    <SchoolIcon className="w-5 h-5" style={{ color: '#C1572B' }} />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-700 block">High School (Lower/Upper Sixth)</span>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {highSchoolFee}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="border-t px-5 sm:px-6 py-3 sm:py-4" style={{ backgroundColor: 'rgba(232, 169, 59, 0.08)', borderColor: 'rgba(232, 169, 59, 0.2)' }}>
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A93B' }} />
            <p className="text-xs sm:text-sm" style={{ color: '#8a6d1f' }}>
              <strong>Note:</strong> Fees cover tuition and core materials. Additional fees for uniforms, transport, and extracurricular activities may apply.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === UNIVERSITY: Programs & Tuition list ===
  const programs = school?.programs || [];
  const iconMap = [
    { icon: GraduationCap, color: '#1F5D45', bg: 'rgba(31, 93, 69, 0.12)' },
    { icon: BookOpen, color: '#C1572B', bg: 'rgba(193, 87, 43, 0.12)' },
    { icon: SchoolIcon, color: '#E8A93B', bg: 'rgba(232, 169, 59, 0.15)' },
  ];

  const displayPrograms = programs.length > 0
    ? programs.map((prog, idx) => ({
        name: prog.name,
        level: prog.level,
        duration: prog.duration,
        amount: prog.tuition ? `${prog.tuition.toLocaleString()} XAF / Year` : 'N/A',
        icon: iconMap[idx % iconMap.length].icon,
        color: iconMap[idx % iconMap.length].color,
        bg: iconMap[idx % iconMap.length].bg,
      }))
    : [];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Fraunces, serif' }}>Programs & Tuition</h2>
        <div className="space-y-3">
          {displayPrograms.length === 0 ? (
            <p className="text-sm sm:text-base text-gray-600">No tuition information available for this institution.</p>
          ) : (
            displayPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: program.bg }}>
                      <Icon className="w-5 h-5" style={{ color: program.color }} />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-medium text-gray-700 block">{program.name}</span>
                      <span className="text-xs text-gray-500">{program.level}{program.duration ? ` · ${program.duration}` : ''}</span>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    {program.amount}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="border-t px-5 sm:px-6 py-3 sm:py-4" style={{ backgroundColor: 'rgba(232, 169, 59, 0.08)', borderColor: 'rgba(232, 169, 59, 0.2)' }}>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#E8A93B' }} />
          <p className="text-xs sm:text-sm" style={{ color: '#8a6d1f' }}>
            <strong>Note:</strong> Fees shown are tuition costs. Additional fees for materials, uniforms, and services may apply.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeeCard;