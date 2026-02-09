import Image from "next/image";
import { useState } from "react";

export const ProductImage = ({
  src,
  alt,
  rounded,
  w,
  h,
}: {
  src: string;
  alt: string;
  rounded?: string;
  w?: number;
  h?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "/images/no_image_dark.webp";

  return (
    <div
      className={`relative block w-full aspect-square overflow-hidden bg-muted ${rounded ? rounded : "rounded-3xl"}`}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gray-600 flex items-center justify-center text-xs text-muted-foreground">
          Cargando...
        </div>
      )}
      <Image
        src={hasError ? fallbackImage : src}
        alt={alt}
        width={w || 400}
        height={h || 400}
        unoptimized
        priority
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};
