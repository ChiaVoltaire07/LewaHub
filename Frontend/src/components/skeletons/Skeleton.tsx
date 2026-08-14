import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base skeleton block. Renders a neutral pulsing placeholder.
 * All other skeletons compose this component.
 */
export default function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      {...props}
    />
  );
}
