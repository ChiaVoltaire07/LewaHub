import { Phone, MapPin, ExternalLink } from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface BottomActionBarProps {
  scrollToMap: () => void;
}

/**
 * Sticky bottom action bar. Only renders real contact links — no hardcoded
 * placeholder phone numbers or "#" website links.
 */
function BottomActionBar({ scrollToMap }: BottomActionBarProps) {
  const { school } = useSchool();

  return (
    <div className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {school?.contactPhone && (
            <a
              href={`tel:${school.contactPhone}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </a>
          )}

          <button
            onClick={scrollToMap}
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>View on Map</span>
          </button>

          {school?.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default BottomActionBar;
