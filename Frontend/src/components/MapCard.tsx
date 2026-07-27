import React, { useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const position = [3.8863, 11.5165];

function MapUpdater() {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 16);
  }, [map]);
  return null;
}

function MapCard({ mapRef }) {
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
        <MapUpdater />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <strong>St. Benedict's International College</strong><br />
              Rue 1.772, Bastos, Yaoundé
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="p-4 sm:p-5 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            Rue 1.772, Opposite the Swiss Embassy, Bastos District.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MapCard;