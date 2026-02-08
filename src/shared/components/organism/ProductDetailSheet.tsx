"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { useProductStore } from "@/features/product/store";
import Image from "next/image";
import { Text } from "../atoms/Text";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { BookmarkIcon } from "lucide-react";

export const ProductDetailSheet = () => {
  const { selectedProduct, isOpen, closeDetails } = useProductStore();

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fallbackImage = "/images/no_image_dark.webp";

  return (
    <Sheet open={isOpen} onOpenChange={closeDetails}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="border-b pb-3">
            <Text size="lg" as="span">
              Detalles del producto
            </Text>
          </SheetTitle>
        </SheetHeader>
        {selectedProduct && (
          <div className="flex-col gap-6 w-full h-full max-w-[400px] mx-auto px-4 ">
            <div className="border-3 relative rounded-4xl">
              <div className="absolute top-0 right-0 m-2 z-10">
                <Badge variant={"secondary"}>
                  <Text>{selectedProduct.brand}</Text>
                  <BookmarkIcon data-icon="inline-end" />
                </Badge>
              </div>
              <div
                key={selectedProduct.id}
                className="relative block w-full h-full max-w-[400px] aspect-square overflow-hidden rounded-3xl bg-muted"
              >
                {isLoading && (
                  <div className="absolute max-w-[400px] w-full aspect-square inset-0 animate-pulse bg-gray-600 flex items-center justify-center text-xs text-muted-foreground">
                    Cargando...
                  </div>
                )}

                <Image
                  src={hasError ? fallbackImage : selectedProduct.image}
                  alt={selectedProduct.name}
                  width={250}
                  height={250}
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
            </div>
            <div className="mt-4 space-y-1 relative max-w-[400px] mx-auto w-full bottom-0 left-0 py-4">
              <div className="bg-cards/95 border rounded-t-xl rounded-b-4xl w-full">
                <Text className="capitalize w-full text-center p-1" size={"sm"}>
                  {selectedProduct.category}
                </Text>
                <div className="bg-white/90 glassomorphism rounded-3xl w-full p-3 flex justify-between items-center">
                  <Text className="text-black/85 font-bold" size={"md"}>
                    {selectedProduct.name}
                  </Text>
                  <Text
                    variant={"title"}
                    size={"lg"}
                    className="text-black font-extrabold"
                  >
                    S/.{selectedProduct.price}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
