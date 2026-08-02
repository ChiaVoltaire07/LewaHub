import React, { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../../lib/api';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultPosition: [number, number] = [3.8863, 11.5165]; // Yaoundé default

interface MapCardProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  schoolId?: string;
}

interface School {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
}

function MapUpdater({ position, initial }: { position: [number, number]; initial: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, initial ? 14 : 16);
    // Force Leaflet to recalculate its size after the container is visible
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map, position, initial]);
  return null;
}

function MapCard({ mapRef, schoolId }: MapCardProps) {
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const position: [number, number] = school 
    ? [school.latitude, school.longitude] 
    : defaultPosition;

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadSchool = async () => {
      try {
        const response = await api.getSchool(schoolId);
        if (!response.error && response.data) {
          setSchool(response.data as School);
        }
      } catch (err) {
        console.error('Failed to load school for map:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchool();
  }, [schoolId]);

  // Ensure map container has height and invalidate size once loaded
  useEffect(() => {
    if (school && !loading) {
      setMapReady(true);
    }
  }, [school, loading]);

  return (
    <div ref={mapRef} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {mapReady && (
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '250px' }}
          className="sm:!h-[300px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater position={position} initial={false} />
          {school && (
            <Marker position={position}>
              <Popup>
                <div className="text-sm">
                  <strong>{school.name}</strong><br />
                  {school.address}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}
      {!mapReady && !loading && !school && (
        <div style={{ width: '100%', height: '250px' }} className="flex items-center justify-center bg-gray-100">
          <p className="text-sm text-gray-500">Location not available</p>
        </div>
      )}
      {loading && (
        <div style={{ width: '100%', height: '250px' }} className="flex items-center justify-center bg-gray-100">
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      )}
      <div className="p-4 sm:p-5 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {school ? `${school.address}, ${school.city}, ${school.region}` : 'Location information loading...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapCard;