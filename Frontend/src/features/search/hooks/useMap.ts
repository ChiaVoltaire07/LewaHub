import { useState, useEffect, useCallback, useRef } from 'react';
import { School } from '../types';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

export const useMap = (schools: School[]) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || map) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      const leafletMap = L.map(mapRef.current!).setView([3.8480, 11.5021], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMap);

      setMap(leafletMap);
      setIsMapReady(true);
    });
  }, [map]);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (!map || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each school
    import('leaflet').then((L) => {
      schools.forEach(school => {
        const marker = L.marker([school.location.lat, school.location.lng])
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <img src="${school.image || DEFAULT_SCHOOL_IMAGE}" alt="${school.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" onerror="this.src='${DEFAULT_SCHOOL_IMAGE}'" />
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1E293B;">${school.name}</h3>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748B;">${school.location.address}</p>
              <button onclick="window.viewSchoolDetails('${school.id}')" style="background: #0F766E; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; width: 100%;">
                View Details
              </button>
            </div>
          `);
        markersRef.current.push(marker);
      });

      // Fit bounds if there are schools
      if (schools.length > 0) {
        const bounds = L.latLngBounds(schools.map(s => [s.location.lat, s.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }, [map, isMapReady, schools]);

  useEffect(() => {
    // Expose viewSchoolDetails function to window for popup buttons
    (window as any).viewSchoolDetails = (schoolId: string) => {
      const school = schools.find(s => s.id === schoolId);
      if (school) {
        setSelectedSchool(school);
      }
    };

    return () => {
      delete (window as any).viewSchoolDetails;
    };
  }, [schools]);

  const flyToSchool = useCallback((school: School) => {
    if (!map) return;
    import('leaflet').then((L) => {
      map.flyTo([school.location.lat, school.location.lng], 15, {
        duration: 1.5
      });
      
      // Open popup for this school
      const marker = markersRef.current.find(m => {
        const latLng = m.getLatLng();
        return latLng.lat === school.location.lat && latLng.lng === school.location.lng;
      });
      
      if (marker) {
        marker.openPopup();
      }
    });
  }, [map]);

  const clearSelection = useCallback(() => {
    setSelectedSchool(null);
  }, []);

  return {
    mapRef,
    map,
    selectedSchool,
    isMapReady,
    setSelectedSchool,
    flyToSchool,
    clearSelection
  };
};