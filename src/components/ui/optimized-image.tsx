import { useState, useCallback, ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad"> {
  src: string;
  alt: string;
  fallback?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  priority?: boolean;
  onLoad?: () => void;
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  auto: "",
};

export function OptimizedImage({
  src,
  alt,
  fallback = "/placeholder.jpg",
  aspectRatio = "auto",
  priority = false,
  onLoad,
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoaded(true);
  }, []);

  // For priority images, don't lazy load
  const loading = priority ? "eager" : "lazy";
  const decoding = priority ? "sync" : "async";

  return (
    <div
      className={`relative overflow-hidden bg-secondary/50 ${aspectRatios[aspectRatio]} ${className}`}
    >
      {/* Placeholder - shows until image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      <img
        src={error ? fallback : src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;