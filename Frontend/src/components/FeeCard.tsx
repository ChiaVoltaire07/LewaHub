import React from 'react';
import { GraduationCap, BookOpen, School, Info } from 'lucide-react';

function FeeCard() {
  const fees = [
    { level: 'Primary Section (Class 1-6)', amount: '350,000 XAF / Year', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { level: 'Secondary Section (Form 1-5)', amount: '550,000 XAF / Year', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { level: 'High School (Lower/Upper Sixth)', amount: '750,000 XAF / Year', icon: School, color: 'text-primary-700', bg: 'bg-primary-50' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Fee Structure</h2>
        <div className="space-y-3">
          {fees.map((fee, index) => {
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
                  <span className="text-sm sm:text-base font-medium text-gray-700">{fee.level}</span>
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
            <strong>Note:</strong> Fees cover tuition and core materials. Uniforms and bus service are separate.
          </p>
        </div>
      </div>
    </div>
  );
}

export default FeeCard;