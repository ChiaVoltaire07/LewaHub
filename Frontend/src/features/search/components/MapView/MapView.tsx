import React, { useEffect, useRef } from 'react';
import { School } from '../../types';
import styles from './MapView.module.css';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

// Cameroon bounds to restrict the map view
const CAMEROON_BOUNDS: [[number, number], [number, number]] = [
  [1.6, 8.4],   // southwest corner
  [13.1, 16.2], // northeast corner
];

interface MapViewProps {
  schools: School[];
  onSchoolClick?: (school: School) => void;
  selectedSchool?: School | null;
}

const MapView: React.FC<MapViewProps> = ({
  schools,
  onSchoolClick,
  selectedSchool
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet CSS
    import('leaflet/dist/leaflet.css');

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          maxBounds: CAMEROON_BOUNDS,
          maxBoundsViscosity: 1.0,
          minZoom: 6,
          maxZoom: 16,
        }).setView([5.5, 12.5], 6); // Center on Cameroon

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        // Force Leaflet to recalculate its size
        setTimeout(() => {
          map.invalidateSize();
        }, 200);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers for each school
      schools.forEach(school => {
        const marker = L.marker([school.location.lat, school.location.lng])
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px; padding: 8px; font-family: Inter, sans-serif;">
              <img src="${school.image || DEFAULT_SCHOOL_IMAGE}" alt="${school.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" onerror="this.src='${DEFAULT_SCHOOL_IMAGE}'" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #14231C; font-family: Georgia, serif;">${school.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #14231C; opacity: 0.7;">${school.location.address}</p>
              <button onclick="window.selectSchool('${school.id}')" style="background: #C1572B; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; width: 100%; font-weight: 600;">
                View Details
              </button>
            </div>
          `);
      });

      // Fit bounds if there are schools
      if (schools.length > 0) {
        const bounds = L.latLngBounds(schools.map((s: School) => [s.location.lat, s.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } else {
        map.setView([5.5, 12.5], 6);
      }

      // Expose selectSchool function to window
      (window as any).selectSchool = (schoolId: string) => {
        const school = schools.find(s => s.id === schoolId);
        if (school && onSchoolClick) {
          onSchoolClick(school);
        }
      };
    });

    return () => {
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [schools, onSchoolClick]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainerRef} className={styles.map} />
    </div>
  );
};

export default MapView;