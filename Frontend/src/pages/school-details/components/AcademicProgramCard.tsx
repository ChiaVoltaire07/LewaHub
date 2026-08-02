import React, { useEffect, useState } from 'react';
import { Globe, Monitor, Trophy, BookOpen } from 'lucide-react';
import api from '../../../lib/api';

interface AcademicProgramCardProps {
  schoolId?: string;
}

interface Program {
  id: string;
  name: string;
  level: string;
  duration: string;
}

function AcademicProgramCard({ schoolId }: AcademicProgramCardProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadPrograms = async () => {
      try {
        const response = await api.getPrograms(schoolId);
        if (!response.error && response.programs) {
          setPrograms(response.programs);
        }
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, [schoolId]);

  const iconMap = [
    { icon: Globe, label: 'International', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Monitor, label: 'Technology', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: Trophy, label: 'Excellence', color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: BookOpen, label: 'Education', color: 'text-primary-700', bg: 'bg-primary-50' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        {loading ? 'Loading Programs...' : `Academic Programs (${programs.length})`}
      </h2>
      
      {programs.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
          No programs available for this school.
        </p>
      ) : (
        <div className="space-y-3 mb-6">
          {programs.map((program, index) => (
            <div
              key={program.id}
              className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900">{program.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{program.level} • {program.duration}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {iconMap.map((feature, index) => {
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