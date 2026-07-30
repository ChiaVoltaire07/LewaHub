import React, { useEffect, useState } from 'react';
import { GraduationCap, BookOpen, School, Info } from 'lucide-react';
import api from '../../../lib/api';

interface FeeCardProps {
  schoolId?: string;
}

interface Program {
  id: string;
  name: string;
  level: string;
  tuition?: number;
}

function FeeCard({ schoolId }: FeeCardProps) {
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
        console.error('Failed to load programs for fees:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, [schoolId]);

  const iconMap = [
    { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: School, color: 'text-primary-700', bg: 'bg-primary-50' },
  ];

  // Use real program data if available, otherwise show a message
  const displayFees = programs.length > 0 
    ? programs.map((prog, idx) => ({
        level: prog.name,
        amount: prog.tuition ? `${prog.tuition.toLocaleString()} XAF / Year` : 'N/A',
        level_desc: prog.level,
        icon: iconMap[idx % iconMap.length].icon,
        color: iconMap[idx % iconMap.length].color,
        bg: iconMap[idx % iconMap.length].bg,
      }))
    : [
        { level: 'Primary Section (Class 1-6)', amount: '350,000 XAF / Year', level_desc: '', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
        { level: 'Secondary Section (Form 1-5)', amount: '550,000 XAF / Year', level_desc: '', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
        { level: 'High School (Lower/Upper Sixth)', amount: '750,000 XAF / Year', level_desc: '', icon: School, color: 'text-primary-700', bg: 'bg-primary-50' },
      ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
          {loading ? 'Loading Fee Structure...' : 'Fee Structure'}
        </h2>
        <div className="space-y-3">
          {displayFees.map((fee, index) => {
            const Icon = fee.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${fee.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${fee.color}`} />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base font-medium text-gray-700 block">{fee.level}</span>
                    {fee.level_desc && <span className="text-xs text-gray-500">{fee.level_desc}</span>}
                  </div>
                </div>
                <span className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap ml-3">
                  {fee.amount}
                </span>
              </div>
            );
          })}
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