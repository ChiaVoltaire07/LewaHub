import React from 'react';
import { GraduationCap, BookOpen, School as SchoolIcon, Info } from 'lucide-react';
import type { School } from './MainContent';

interface FeeCardProps {
  school: School | null;
  loading: boolean;
}

function FeeCard({ school, loading }: FeeCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Loading Fee Structure...</h2>
        </div>
      </div>
    );
  }

  // === PRIMARY / NURSERY: single Annual Fee row ===
  if (school?.category === 'PrimaryNursery') {
    const primaryProgram = school.programs?.find((p) => p.level === 'Primary' || p.level === 'Nursery');
    const annualFee = primaryProgram?.tuition
      ? `${primaryProgram.tuition.toLocaleString()} XAF / Year`
      : 'N/A';

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Annual Fee</h2>
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm sm:text-base font-medium text-gray-700 block">
                {school.name}
              </span>
            </div>
            <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3">
              {annualFee}
            </span>
          </div>
        </div>
        <div className="bg-amber-50 border-t border-amber-100 px-5 sm:px-6 py-3 sm:py-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-amber-800">
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
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Fee Structure</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-medium text-gray-700 block">Secondary (Form 1–5)</span>
                </div>
              </div>
              <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3">
                {secondaryFee}
              </span>
            </div>

            {school.offersHighSchool && (
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <SchoolIcon className="w-5 h-5 text-primary-700" />
                </div>
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-700 block">High School (Lower/Upper Sixth)</span>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3">
                  {highSchoolFee}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-amber-50 border-t border-amber-100 px-5 sm:px-6 py-3 sm:py-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-amber-800">
              <strong>Note:</strong> Fees shown are tuition costs. Additional fees for materials, uniforms, and services may apply.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // === UNIVERSITY: Programs & Tuition list ===
  const programs = school?.programs || [];
  const iconMap = [
    { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: SchoolIcon, color: 'text-primary-700', bg: 'bg-primary-50' },
  ];

  const displayPrograms = programs.length > 0
    ? programs.map((prog, idx) => ({
        name: prog.name,
        level: prog.level,
        amount: prog.tuition ? `${prog.tuition.toLocaleString()} XAF / Year` : 'N/A',
        icon: iconMap[idx % iconMap.length].icon,
        color: iconMap[idx % iconMap.length].color,
        bg: iconMap[idx % iconMap.length].bg,
      }))
    : [];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Programs & Tuition</h2>
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
                    <div className={`w-10 h-10 ${program.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${program.color}`} />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-medium text-gray-700 block">{program.name}</span>
                      <span className="text-xs text-gray-500">{program.level}</span>
                    </div>
                  </div>
                  <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3">
                    {program.amount}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="bg-amber-50 border-t border-amber-100 px-5 sm:px-6 py-3 sm:py-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-amber-800">
            <strong>Note:</strong> Fees shown are tuition costs. Additional fees for materials, uniforms, and services may apply.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeeCard;