import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock3 } from 'lucide-react';
import api from '../../../lib/api';
import { SchoolDetail } from '../../../types/school';

interface StatusBadgesProps {
  schoolId?: string;
}

/** Real verification status from the backend — no invented evaluation/accreditation claims. */
function StatusBadges({ schoolId }: StatusBadgesProps) {
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadSchool = async () => {
      try {
        const response = await api.getSchool(schoolId);
        if (!response.error && response.data) {
          setSchool(response.data as SchoolDetail);
        }
      } catch (err) {
        console.error('Failed to load school status:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchool();
  }, [schoolId]);

  const verified = !!school?.verified;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 flex items-center gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${verified ? 'bg-green-100' : 'bg-gray-100'}`}>
            {verified
              ? <CheckCircle2 className="w-6 h-6 text-green-600" />
              : <Clock3 className="w-6 h-6 text-gray-500" />}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              Verification Status
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {loading ? 'Loading...' : verified ? 'Verified' : 'Not yet verified'}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
              Listing Source
            </p>
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {loading ? 'Loading...' : school?.category || 'School'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StatusBadges;
