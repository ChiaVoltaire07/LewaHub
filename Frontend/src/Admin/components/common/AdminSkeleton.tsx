interface AdminSkeletonProps {
  rows?: number;
}

export function AdminSkeleton({ rows = 4 }: AdminSkeletonProps) {
  return (
    <div className="space-y-6 animate-pulse" data-testid="admin-skeleton">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-border-light p-6">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}
