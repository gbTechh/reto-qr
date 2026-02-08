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
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { BookmarkIcon } from "lucide-react";
import { ProductImage } from "./ProductImage";

export const ProductDetailSheet = () => {
  const { selectedProduct, isOpen, closeDetails } = useProductStore();

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
              <ProductImage
                key={selectedProduct.id}
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
            </div>
            <div className="mt-4 space-y-1 relative max-w-[400px] mx-auto w-full bottom-0 left-0 py-4">
              <div className="bg-cards/95 border rounded-t-xl rounded-b-4xl w-full">
                <Text
                  className="text-white apitalize w-full text-center p-1"
                  size={"sm"}
                >
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
