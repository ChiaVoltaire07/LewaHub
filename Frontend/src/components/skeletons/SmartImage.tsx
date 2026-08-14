import React, { useEffect, useState } from "react";
import Skeleton from "./Skeleton";

interface SmartImageProps {
  src?: string;
  alt: string;
  /** Classes applied to the outer container, e.g. a CSS-module sizing class */
  containerClassName?: string;
  /** Extra classes for the <img> itself */
  className?: string;
  /** Tried automatically when the primary src fails (project default image) */
  fallbackSrc?: string;
  /** Rendered when src and fallbackSrc both fail; prevents broken-image icons */
  fallback?: React.ReactNode;
  loading?: "lazy" | "eager";
  /** Extra props passed to the <img> (e.g. srcSet, sizes) */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

/**
 * Image that shows a skeleton placeholder while loading, fades the real image
 * in, falls back to `fallbackSrc` on error, and renders `fallback` content
 * (never a broken-image icon) when everything fails.
 *
 * The `<img>` stays in normal document flow inside a relative wrapper so the
 * container keeps its natural height. `containerClassName` fully controls the
 * outer box (sizing/positioning) and is never overridden by default classes.
 */
export default function SmartImage({
  src,
  alt,
  containerClassName = "",
  className = "",
  fallbackSrc,
  fallback,
  loading = "lazy",
  imgProps,
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const showImage = !!currentSrc && !failed;

  const handleError = () => {
    if (fallbackSrc && fallbackSrc !== currentSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className={`h-full w-full overflow-hidden bg-gray-100 ${containerClassName}`}
      role="img"
      aria-label={alt}
    >
      <div className="relative h-full w-full">
        {(!loaded || !showImage) && (
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        )}

        {showImage && (
          <img
            src={currentSrc}
            alt={alt}
            loading={loading}
            onLoad={() => setLoaded(true)}
            onError={handleError}
            className={`h-full w-full object-cover transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            } ${className}`}
            {...imgProps}
          />
        )}

        {failed && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {fallback}
          </div>
        )}
      </div>
    </div>
  );
}
