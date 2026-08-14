import React, { useEffect, useRef, useState } from 'react';
import { School } from '../../types';
import { formatDistance } from '../../utils/formatDistance';
import MapSkeleton from '../../../../components/skeletons/MapSkeleton';
import styles from './MapView.module.css';

const DEFAULT_SCHOOL_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

// Cameroon bounds to restrict the map view
const CAMEROON_BOUNDS: [[number, number], [number, number]] = [
  [1.6, 8.4],   // southwest corner
  [13.1, 16.2], // northeast corner
];

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  schools: School[];
  onSchoolClick?: (school: School) => void;
  selectedSchool?: School | null;
  /** Present while the "schools near me" mode is active */
  userLocation?: UserLocation | null;
  radiusKm?: number;
}

const MapView: React.FC<MapViewProps> = ({
  schools,
  onSchoolClick,
  userLocation,
  radiusKm
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  // Overlay layers (user marker + radius circle) are tracked so each render
  // pass removes the previous ones before re-adding them.
  const overlayLayersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let isActive = true;

    // Dynamically import Leaflet CSS
    import('leaflet/dist/leaflet.css');

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!isActive) return;

      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          minZoom: 6,
          maxZoom: 16,
          maxBoundsViscosity: 1.0,
        });

        // Cameroon national borders — initial view and hard panning limit
        const cameroonBounds = L.latLngBounds(CAMEROON_BOUNDS);
        map.setMaxBounds(cameroonBounds);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).on('load', () => {
          if (isActive) setMapReady(true);
        }).addTo(map);

        // Force Leaflet to recalculate its size, then fit Cameroon on load
        setTimeout(() => {
          map.invalidateSize();
          map.fitBounds(cameroonBounds, { padding: [10, 10] });
        }, 200);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear previous markers and nearby overlays
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      overlayLayersRef.current.forEach((layer: any) => {
        if (layer) map.removeLayer(layer);
      });
      overlayLayersRef.current = [];

      // Only schools with valid coordinates can be placed on the map
      const positioned = schools.filter(
        (s) => typeof s.location.lat === 'number' && typeof s.location.lng === 'number'
      );

      // Add markers for each school. The popup is built with DOM APIs and
      // textContent (never string-concatenated HTML) to avoid HTML injection.
      positioned.forEach(school => {
        const lat = school.location.lat as number;
        const lng = school.location.lng as number;

        const popup = L.DomUtil.create('div');
        popup.style.minWidth = '200px';
        popup.style.padding = '8px';
        popup.style.fontFamily = 'Inter, sans-serif';

        const img = L.DomUtil.create('img');
        img.src = school.image || DEFAULT_SCHOOL_IMAGE;
        img.alt = school.name;
        img.style.width = '100%';
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '8px';
        img.style.marginBottom = '8px';
        img.addEventListener('error', () => {
          img.src = DEFAULT_SCHOOL_IMAGE;
        });
        popup.appendChild(img);

        const name = L.DomUtil.create('h3');
        name.textContent = school.name;
        name.style.margin = '0 0 4px 0';
        name.style.fontSize = '16px';
        name.style.fontWeight = '600';
        name.style.color = '#14231C';
        name.style.fontFamily = 'Georgia, serif';
        popup.appendChild(name);

        const address = L.DomUtil.create('p');
        address.textContent = school.location.address;
        address.style.margin = '0 0 8px 0';
        address.style.fontSize = '13px';
        address.style.color = '#14231C';
        address.style.opacity = '0.7';
        popup.appendChild(address);

        // Distance line only in nearby mode (schools carry distanceKm)
        if (typeof school.distanceKm === 'number') {
          const distance = L.DomUtil.create('p');
          const parts = formatDistance(school.distanceKm);
          const label = parts.meters != null
            ? `${parts.meters} m`
            : `${parts.km} km`;
          distance.textContent = label;
          distance.style.margin = '0 0 8px 0';
          distance.style.fontSize = '13px';
          distance.style.fontWeight = '600';
          distance.style.color = '#1F5D45';
          popup.appendChild(distance);
        }

        const button = L.DomUtil.create('button');
        button.textContent = 'View Details';
        button.style.background = '#C1572B';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '8px 16px';
        button.style.borderRadius = '8px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px';
        button.style.width = '100%';
        button.style.fontWeight = '600';
        button.addEventListener('click', () => {
          if (onSchoolClick) onSchoolClick(school);
        });
        popup.appendChild(button);

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(popup);
      });

      // User marker + search-radius circle while in nearby mode
      if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
        const userLatLng = L.latLng(userLocation.latitude, userLocation.longitude);

        const userPopup = L.DomUtil.create('div');
        userPopup.style.padding = '4px';
        userPopup.style.fontFamily = 'Inter, sans-serif';
        const you = L.DomUtil.create('strong');
        you.textContent = 'You are here';
        you.style.color = '#14231C';
        userPopup.appendChild(you);

        const userMarker = L.circleMarker(userLatLng, {
          radius: 8,
          color: '#1F5D45',
          weight: 3,
          fillColor: '#1F5D45',
          fillOpacity: 0.9,
        }).addTo(map);
        userMarker.bindPopup(userPopup);
        overlayLayersRef.current.push(userMarker);

        if (typeof radiusKm === 'number' && radiusKm > 0) {
          const circle = L.circle(userLatLng, {
            radius: radiusKm * 1000,
            color: '#1F5D45',
            weight: 2,
            dashArray: '6, 6',
            fillColor: '#1F5D45',
            fillOpacity: 0.08,
            interactive: false,
          }).addTo(map);
          overlayLayersRef.current.push(circle);
        }
      }

      // Fit bounds to nearby context (user + schools) or all schools, else Cameroon
      const cameroonBounds = L.latLngBounds(CAMEROON_BOUNDS);
      const fitPoints: [number, number][] = positioned.map(
        (s) => [s.location.lat as number, s.location.lng as number] as [number, number]
      );
      if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
        fitPoints.push([userLocation.latitude, userLocation.longitude]);
      }

      if (fitPoints.length > 0) {
        const bounds = L.latLngBounds(fitPoints);
        // Pad by the radius so the whole search circle is visible when in nearby mode
        const radiusKmValue = typeof radiusKm === 'number' && radiusKm > 0 ? radiusKm : undefined;
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: radiusKmValue != null ? 13 : 12,
        });
        if (radiusKmValue != null && radiusKmValue > 4) {
          map.setZoom(Math.min(map.getZoom(), 11));
        }
      } else {
        map.fitBounds(cameroonBounds);
      }
    });

    return () => {
      isActive = false;
      // Cleanup map on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [schools, onSchoolClick, userLocation, radiusKm]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapContainerRef} className={styles.map} />
      {!mapReady && (
        <div className="pointer-events-none absolute inset-0 z-[400]">
          <MapSkeleton className="h-full min-h-0 rounded-none border-0" />
        </div>
      )}
    </div>
  );
};

export default MapView;
