import Skeleton from "./Skeleton";

/** Hero image block for the school details page */
export function HeroSkeleton() {
  return (
    <section
      aria-busy="true"
      className="relative h-[50vh] min-h-[400px] w-full overflow-hidden bg-gray-200 sm:h-[55vh] md:h-[60vh] lg:h-[65vh]"
    >
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute bottom-6 left-4 right-4 space-y-3 sm:bottom-10 sm:left-8">
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-10 w-2/3 max-w-xl" />
        <Skeleton className="h-5 w-1/3 max-w-xs" />
      </div>
    </section>
  );
}

/** Sidebar contact/info card */
export function InfoCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-5 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-10 w-full rounded-lg" />
    </div>
  );
}

/** Fee structure card rows */
export function FeeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
      <div className="p-5 sm:p-6">
        <Skeleton className="h-6 w-40" />
        <div className="mt-4 space-y-3">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3 sm:p-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t px-5 py-3 sm:px-6 sm:py-4">
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Academic program / facility card */
export function ProgramCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-md sm:p-6">
      <Skeleton className="h-6 w-48" />
      <div className="mt-4 flex flex-wrap gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
