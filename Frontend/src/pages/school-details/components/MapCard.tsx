import { useEffect, useState } from 'react';
import { MapPin, MapPinOff, Phone, ExternalLink, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RefObject } from 'react';
import 'leaflet/dist/leaflet.css';
import api from '../../../lib/api';
import MapSkeleton from '../../../components/skeletons/MapSkeleton';
import { SchoolDetail } from '../../../types/school';

// Fixed, responsive map height used by the map, the loading skeleton and the
// empty state alike. Keeping the height constant across states prevents the
// page from jumping while the school (and its coordinates) are being loaded.
const MAP_HEIGHT_CLASSES = 'h-64 sm:h-72 lg:h-80';

// Cameroon default (Yaoundé) used only when coordinates are missing — the map
// itself is hidden in that case; this guards the initial center before load.
const defaultPosition: [number, number] = [3.8863, 11.5165];
const MAP_ZOOM = 15;

const SCHOOL_PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44" aria-hidden="true">
  <defs>
    <filter id="school-pin-shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#004F42" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path d="M17 1C8.2 1 1 8.2 1 17c0 11 16 26 16 26s16-15 16-26C33 8.2 25.8 1 17 1z"
        fill="#006D5B" stroke="#ffffff" stroke-width="2.5" filter="url(#school-pin-shadow)"/>
  <circle cx="17" cy="17" r="6.5" fill="#ffffff"/>
  <circle cx="17" cy="17" r="3.2" fill="#C1572B"/>
</svg>`;

const schoolPinIcon = L.divIcon({
  className: 'school-map-pin',
  html: SCHOOL_PIN_SVG,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -40],
});

interface MapCardProps {
  mapRef: RefObject<HTMLDivElement>;
  schoolId?: string;
}

/**
 * Keeps the Leaflet map centred and correctly sized. Leaflet measures its
 * container at init time, so while a route transition or lazy layout is still
 * animating the map can render blank/gray tiles. We invalidate the size on a
 * few ticks (initial mount, tiles ready, and after layout settles) plus on
 * window resize — this makes the map stable without depending on animation
 * callbacks from the page shell.
 */
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const settle = () => {
      if (cancelled) return;
      map.invalidateSize();
      map.setView(position, MAP_ZOOM, { animate: false });
    };

    settle();

    const onReady = () => {
      if (cancelled) return;
      settle();
      timers.push(
        window.setTimeout(settle, 150),
        window.setTimeout(settle, 450)
      );
    };
    map.whenReady(onReady);

    const onResize = () => settle();
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('resize', onResize);
    };
  }, [map, position]);

  return null;
}

function MapCard({ mapRef, schoolId }: MapCardProps) {
  const [school, setSchool] = useState<SchoolDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const hasCoords =
    !!school &&
    typeof school.latitude === 'number' &&
    typeof school.longitude === 'number';
  const position: [number, number] = hasCoords
    ? [school!.latitude as number, school!.longitude as number]
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
          setSchool(response.data as SchoolDetail);
        }
      } catch (err) {
        console.error('Failed to load school for map:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchool();
  }, [schoolId]);

  const showMap = !loading && hasCoords;
  const showEmpty = !loading && !hasCoords;

  return (
    <div
      ref={mapRef}
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden scroll-mt-24"
    >
      <div className="p-5 sm:p-6 pb-4">
        <h2
          className="text-lg sm:text-xl font-bold text-gray-900"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          Location
        </h2>
      </div>

      <div className="relative">
        {showMap && (
          <MapContainer
            center={position}
            zoom={MAP_ZOOM}
            scrollWheelZoom={false}
            maxZoom={18}
            className={`${MAP_HEIGHT_CLASSES} w-full`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater position={position} />
            <Marker position={position} icon={schoolPinIcon}>
              <Popup>
                <div className="map-popup">
                  <strong className="block text-sm font-bold text-gray-900">
                    {school?.name}
                  </strong>
                  <span className="mt-0.5 block text-xs text-gray-600">
                    {school?.address}
                  </span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )}

        {loading && (
          <div className={MAP_HEIGHT_CLASSES}>
            <MapSkeleton className="h-full rounded-none border-0" />
          </div>
        )}

        {showEmpty && (
          <div
            className={`${MAP_HEIGHT_CLASSES} flex w-full flex-col items-center justify-center gap-3 bg-bg-soft px-6 text-center`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-light">
              <MapPinOff className="h-6 w-6 text-teal-primary" />
            </div>
            <p className="text-sm font-semibold text-text-dark">
              No location data available
            </p>
            <p className="text-xs leading-relaxed text-text-muted">
              This school has not published its coordinates yet.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 border-t border-gray-100">
        <div className="flex items-start gap-2">
          <MapPin
            className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-primary"
          />
          <p className="text-sm text-gray-600">
            {school
              ? `${school.address}, ${school.city}, ${school.region}`
              : 'Location information loading...'}
          </p>
        </div>

        {school && (
          <div className="flex flex-wrap gap-2 mt-4">
            {school.contactPhone && (
              <a
                href={`tel:${school.contactPhone}`}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors bg-teal-light text-teal-primary hover:bg-teal-primary hover:text-white"
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
            )}
            {hasCoords && (
              <a
                href={`https://www.google.com/maps?q=${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors bg-teal-light text-teal-primary hover:bg-teal-primary hover:text-white"
              >
                <LocateFixed className="w-3.5 h-3.5" />
                View on Map
              </a>
            )}
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white rounded-lg transition-colors bg-[#C1572B] hover:bg-[#a84a24]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit Website
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MapCard;
