import React from 'react';
import { Globe, Monitor, Trophy, BookOpen } from 'lucide-react';

function AcademicProgramCard() {
  const features = [
    { icon: Globe, label: 'Bilingual Training', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Monitor, label: 'IT Laboratory', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Trophy, label: 'Sports Facilities', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: BookOpen, label: 'Library Services', color: 'text-primary-700', bg: 'bg-primary-50' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Academic Program</h2>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
        Offering a comprehensive bilingual curriculum that integrates the Cameroonian National Education standards
        with international best practices in STEM and creative arts.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-2.5 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
            >
              <div className={`w-9 h-9 ${feature.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${feature.color}`} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700">{feature.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AcademicProgramCard;