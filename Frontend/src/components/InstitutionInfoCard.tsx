import React from 'react';
import { Calendar, Users, UserCheck } from 'lucide-react';

function InstitutionInfoCard() {
  const infoItems = [
    { icon: Calendar, label: 'Founded', value: '1998', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Users, label: 'Student Capacity', value: '1,200', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: UserCheck, label: 'Faculty Size', value: '85 Teachers', color: 'text-primary-700', bg: 'bg-primary-50' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">Institution Info</h2>
      <div className="space-y-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-default"
            >
              <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InstitutionInfoCard;