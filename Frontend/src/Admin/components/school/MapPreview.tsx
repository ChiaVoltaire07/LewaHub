import { useEffect, useState } from "react";
import { MapPin, MapPinOff } from "lucide-react";
import MapSkeleton from "../../../components/skeletons/MapSkeleton";

const defaultPosition: [number, number] = [3.8863, 11.5165];
const MAP_ZOOM = 13;

const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44" aria-hidden="true">
  <defs>
    <filter id="admin-pin-shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#004F42" flood-opacity="0.35"/>
    </filter>
  </defs>
  <path d="M17 1C8.2 1 1 8.2 1 17c0 11 16 26 16 26s16-15 16-26C33 8.2 25.8 1 17 1z"
        fill="#006D5B" stroke="#ffffff" stroke-width="2.5" filter="url(#admin-pin-shadow)"/>
  <circle cx="17" cy="17" r="6.5" fill="#ffffff"/>
  <circle cx="17" cy="17" r="3.2" fill="#C1572B"/>
</svg>`;

interface MapPreviewProps {
  latitude: number | null;
  longitude: number | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
}

export function MapPreview({ latitude, longitude, address, city, region }: MapPreviewProps) {
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";
  const position: [number, number] = hasCoords ? [latitude as number, longitude as number] : defaultPosition;
  const [MapComponents, setMapComponents] = useState<any>(null);

  const locationText = [address, city, region].filter(Boolean).join(", ");

  useEffect(() => {
    if (!hasCoords) return;

    let cancelled = false;
    const loadLeaflet = async () => {
      try {
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        const reactLeaflet = await import("react-leaflet");
        if (!cancelled) {
          setMapComponents({
            MapContainer: reactLeaflet.MapContainer,
            TileLayer: reactLeaflet.TileLayer,
            Marker: reactLeaflet.Marker,
            useMap: reactLeaflet.useMap,
            L: leaflet.default,
          });
        }
      } catch {
        // Leaflet failed to load
      }
    };

    loadLeaflet();
    return () => { cancelled = true; };
  }, [hasCoords]);

  if (!hasCoords) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-3 bg-bg-soft rounded-lg border border-border-light px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-light">
          <MapPinOff className="h-6 w-6 text-teal-primary" />
        </div>
        <p className="text-sm font-semibold text-text-dark">No coordinates</p>
        <p className="text-xs text-text-muted">
          {locationText || "This school has not published its coordinates yet."}
        </p>
      </div>
    );
  }

  if (!MapComponents) {
    return (
      <div className="h-64">
        <MapSkeleton className="h-full rounded-lg border-0" />
      </div>
    );
  }

  const pinIcon = MapComponents.L.divIcon({
    className: "school-map-pin",
    html: PIN_SVG,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    popupAnchor: [0, -40],
  });

  function MapUpdater({ position: pos }: { position: [number, number] }) {
    const map = MapComponents.useMap();
    useEffect(() => {
      map.invalidateSize();
      map.setView(pos, MAP_ZOOM, { animate: false });
      const onResize = () => map.invalidateSize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [map, pos]);
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-light">
      <MapComponents.MapContainer
        center={position}
        zoom={MAP_ZOOM}
        scrollWheelZoom={false}
        maxZoom={18}
        className="h-64 w-full"
      >
        <MapComponents.TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater position={position} />
        <MapComponents.Marker position={position} icon={pinIcon}>
          <span className="sr-only">{locationText || "School location"}</span>
        </MapComponents.Marker>
      </MapComponents.MapContainer>
      {locationText && (
        <div className="flex items-start gap-2 px-4 py-3 bg-white border-t border-border-light">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-primary" />
          <p className="text-sm text-text-muted">{locationText}</p>
        </div>
      )}
    </div>
  );
}
