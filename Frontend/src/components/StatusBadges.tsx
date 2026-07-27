import React from 'react';
import { ShieldCheck, Medal } from 'lucide-react';

function StatusBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              Evaluation Status
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              High Performance
            </p>
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <Medal className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              Accreditation
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              MINESEC Certified
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatusBadges;