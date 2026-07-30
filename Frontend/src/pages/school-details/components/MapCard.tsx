import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '../../../lib/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const defaultPosition = [3.8863, 11.5165]; // Yaoundé default

interface MapCardProps {
  mapRef: React.RefObject<HTMLDivElement | null>;
  schoolId?: string;
}

interface Institution {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
}

function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 16);
  }, [map, position]);
  return null;
}

function MapCard({ mapRef, schoolId }: MapCardProps) {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  
  const position: [number, number] = institution 
    ? [institution.latitude, institution.longitude] 
    : defaultPosition;

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }

    const loadInstitution = async () => {
      try {
        const response = await api.getInstitution(schoolId);
        if (!response.error && response.data) {
          setInstitution(response.data);
        }
      } catch (err) {
        console.error('Failed to load institution for map:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInstitution();
  }, [schoolId]);

  return (
    <div ref={mapRef} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-[250px] sm:h-[300px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater position={position} />
        {!loading && institution && (
          <Marker position={position}>
            <Popup>
              <div className="text-sm">
                <strong>{institution.name}</strong><br />
                {institution.address}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="p-4 sm:p-5 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {institution ? `${institution.address}, ${institution.city}, ${institution.region}` : 'Location information loading...'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapCard;