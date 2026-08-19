import { useEffect, useState } from 'react';
import { MapPin, MapPinOff, Phone, ExternalLink, LocateFixed } from 'lucide-react';
import type { RefObject } from 'react';
import { useSchool } from '../context/SchoolContext';
import MapSkeleton from '../../../components/skeletons/MapSkeleton';

const MAP_HEIGHT_CLASSES = 'h-64 sm:h-72 lg:h-80';

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

interface MapCardProps {
  mapRef: RefObject<HTMLDivElement>;
}

function MapUpdater({ position, useMap }: { position: [number, number]; useMap: any }) {
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

function MapCard({ mapRef }: MapCardProps) {
  const { school, loading } = useSchool();
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
    useMap: any;
    L: any;
  } | null>(null);

  const hasCoords =
    !!school &&
    typeof school.latitude === 'number' &&
    typeof school.longitude === 'number';
  const position: [number, number] = hasCoords
    ? [school!.latitude as number, school!.longitude as number]
    : defaultPosition;

  useEffect(() => {
    if (!hasCoords || !school) return;

    let cancelled = false;
    const loadLeaflet = async () => {
      try {
        const leaflet = await import('leaflet');
        await import('leaflet/dist/leaflet.css');
        const reactLeaflet = await import('react-leaflet');
        if (!cancelled) {
          setMapComponents({
            MapContainer: reactLeaflet.MapContainer,
            TileLayer: reactLeaflet.TileLayer,
            Marker: reactLeaflet.Marker,
            Popup: reactLeaflet.Popup,
            useMap: reactLeaflet.useMap,
            L: leaflet.default,
          });
        }
      } catch {
        // Leaflet failed to load — show empty state
      }
    };

    loadLeaflet();
    return () => { cancelled = true; };
  }, [hasCoords, school]);

  const showMap = !loading && hasCoords && !!MapComponents;
  const showEmpty = !loading && !hasCoords;
  const showLoading = loading;

  const schoolPinIcon = MapComponents
    ? MapComponents.L.divIcon({
        className: 'school-map-pin',
        html: SCHOOL_PIN_SVG,
        iconSize: [34, 44],
        iconAnchor: [17, 44],
        popupAnchor: [0, -40],
      })
    : null;

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
          <MapComponents.MapContainer
            center={position}
            zoom={MAP_ZOOM}
            scrollWheelZoom={false}
            maxZoom={18}
            className={`${MAP_HEIGHT_CLASSES} w-full`}
          >
            <MapComponents.TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater position={position} useMap={MapComponents.useMap} />
            <MapComponents.Marker position={position} icon={schoolPinIcon}>
              <MapComponents.Popup>
                <div className="map-popup">
                  <strong className="block text-sm font-bold text-gray-900">
                    {school?.name}
                  </strong>
                  <span className="mt-0.5 block text-xs text-gray-600">
                    {school?.address}
                  </span>
                </div>
              </MapComponents.Popup>
            </MapComponents.Marker>
          </MapComponents.MapContainer>
        )}

        {showLoading && (
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
