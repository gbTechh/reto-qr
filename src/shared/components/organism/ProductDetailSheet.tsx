"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { useProductStore } from "@/features/product/store";
import Image from "next/image";

export const ProductDetailSheet = () => {
  const { selectedProduct, isOpen, closeDetails } = useProductStore();

  return (
    <Sheet open={isOpen} onOpenChange={closeDetails}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>{selectedProduct?.name}</SheetTitle>
        </SheetHeader>
        {selectedProduct && (
          <div className="py-6">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full max-w-[200px] mx-auto rounded-lg"
              width={200}
              height={200}
            />
            <div className="mt-4 space-y-2">
              <p>
                <strong>Marca:</strong> {selectedProduct.brand}
              </p>
              <p>
                <strong>Precio:</strong> S/. {selectedProduct.price}
              </p>
              <p className="capitalize">
                <strong>Categoría:</strong> {selectedProduct.category}
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
