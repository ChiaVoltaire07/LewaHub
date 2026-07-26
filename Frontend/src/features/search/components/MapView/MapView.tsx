import React, { useEffect } from 'react';
import { School } from '../../types';
import styles from './MapView.module.css';

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
  useEffect(() => {
    // Dynamically import Leaflet CSS
    import('leaflet/dist/leaflet.css');
  }, []);

  return (
    <div className={styles.mapContainer}>
      <div ref={(el) => {
        if (el && !el.hasChildNodes()) {
          import('leaflet').then((L) => {
            const map = L.map(el).setView([3.8480, 11.5021], 6);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

                            // Add markers for each school
                            schools.forEach(school => {
                              const marker = L.marker([school.location.lat, school.location.lng])
                                .addTo(map)
                                .bindPopup(`
                                  <div style="min-width: 200px; padding: 8px; font-family: Inter, sans-serif;">
                                    <img src="${school.image}" alt="${school.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
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
              const bounds = L.latLngBounds(schools.map(s => [s.location.lat, s.location.lng]));
              map.fitBounds(bounds, { padding: [50, 50] });
            }

            // Expose selectSchool function to window
            (window as any).selectSchool = (schoolId: string) => {
              const school = schools.find(s => s.id === schoolId);
              if (school && onSchoolClick) {
                onSchoolClick(school);
              }
            };
          });
        }
      }} className={styles.map} />
    </div>
  );
};

export default MapView;