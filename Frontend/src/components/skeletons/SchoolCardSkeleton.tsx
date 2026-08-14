import Skeleton from "./Skeleton";

interface SchoolCardSkeletonProps {
  /** "row" matches the search result card; "stack" matches the home featured card */
  layout?: "row" | "stack";
}

export default function SchoolCardSkeleton({ layout = "row" }: SchoolCardSkeletonProps) {
  if (layout === "stack") {
    return (
      <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-gray-200 bg-white">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-200">
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          <div className="absolute left-3 top-3 z-10 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-[18px]">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm" />
            ))}
            <Skeleton className="ml-1 h-3.5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    );
  }

  // Search card: column on mobile (image 200px), row on md+ (image 280px wide)
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white md:flex-row">
      <div className="relative h-[200px] w-full flex-shrink-0 md:h-auto md:min-h-[240px] md:w-[280px]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <div className="absolute right-3 top-3 z-10">
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <div className="absolute bottom-3 left-3 z-10">
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-[10px] p-5">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-[18px] w-2/3" />
          <Skeleton className="h-5 w-12 rounded-md" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="h-[22px] w-20 rounded-md" />
          <Skeleton className="h-[22px] w-16 rounded-md" />
          <Skeleton className="h-[22px] w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-auto h-11 w-full rounded-lg" />
      </div>
    </div>
  );
}
