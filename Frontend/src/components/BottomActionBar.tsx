import React from 'react';
import { Phone, MapPin, ExternalLink } from 'lucide-react';

function BottomActionBar({ scrollToMap }) {
  return (
    <div className="sticky bottom-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          
          <a
            href="tel:+237123456789"
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </a>

          <button
            onClick={scrollToMap}
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>View on Map</span>
          </button>

          <a
            href="#"
            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-white bg-primary-700 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Visit Website</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default BottomActionBar;