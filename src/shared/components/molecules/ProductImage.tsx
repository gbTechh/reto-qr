import Image from "next/image";
import { useState } from "react";

// Este componente se reinicia solo gracias a la prop 'key'
export const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fallbackImage = "/images/no_image_dark.webp";

  return (
    <div className="relative block w-full aspect-square overflow-hidden rounded-3xl bg-muted">
      {isLoading && (
        <div className="absolute inset-0 z-10 animate-pulse bg-gray-600 flex items-center justify-center text-xs text-muted-foreground">
          Cargando...
        </div>
      )}
      <Image
        src={hasError ? fallbackImage : src}
        alt={alt}
        width={400}
        height={400}
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
