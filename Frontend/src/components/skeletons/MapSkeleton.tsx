import Skeleton from "./Skeleton";

interface MapSkeletonProps {
  className?: string;
}

/**
 * Map-shaped loading placeholder. Keeps the map area from being a blank
 * rectangle while Leaflet/OpenStreetMap loads tiles.
 */
export default function MapSkeleton({ className = "" }: MapSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-full min-h-[250px] w-full overflow-hidden rounded-lg border border-gray-200 bg-teal-light/70 ${className}`}
    >
      {/* Subtle map grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,109,91,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,109,91,0.10) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Fake zoom controls */}
      <div className="absolute left-3 top-3 z-10 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
        <div className="flex h-8 w-8 items-center justify-center border-b border-gray-200 text-sm font-semibold text-gray-400">
          +
        </div>
        <div className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-400">
          −
        </div>
      </div>

      {/* Fake markers */}
      <div className="absolute left-1/2 top-1/3 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-teal-primary shadow" />
      <div className="absolute left-[38%] top-[55%] z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-teal-primary/70 shadow" />
      <div className="absolute left-[60%] top-[48%] z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-teal-primary/50 shadow" />

      {/* Fake attribution bar */}
      <Skeleton className="absolute inset-x-0 bottom-0 z-10 h-5 w-full rounded-none" />
    </div>
  );
}
