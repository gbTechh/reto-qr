"use client";
import { Text } from "@/components/atoms/Text";
import { ProductCard } from "@/components/molecules/ProductCard";
import { HistorySearch } from "@/components/molecules/SerchInputHistorial";
import { useProductStore } from "@/features/product/store";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ProductDetailSheet } from "@/components/organism/ProductDetailSheet";

export default function HistorialPage() {
  const history = useProductStore((state) => state.history);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history.filter((product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search)
    );
  });
  return (
    <>
      <section className="centralize flex-col gap-6 pt-8 md:pt-10 relative flex-1">
        <div className="centralize w-full centralize px-10 h-[5dvh]">
          <Text as="h1" size={"2xl"} variant={"title"}>
            Historial de productos
          </Text>
        </div>
        <HistorySearch value={searchTerm} onChange={setSearchTerm} />

        <div className="space-y-3 px-4 overflow-y-scroll h-[70dvh] pb-10 w-full no-scrollbar">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="py-20 text-center space-y-2">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No hay coincidencias"
                  : "Tu historial está vacío"}
              </p>
            </div>
          )}
        </div>
        <ProductDetailSheet />
      </section>

      <div className="w-full h-20 absolute bottom-0 left-0 flex items-end justify-center">
        <div className="h-full aspect-square  rounded-bl-none rounded-full round-left"></div>
        <div className="runded-t-full bg-white w-14 h-full rounded-t-full p-1 z-10">
          <Link
            href="/"
            className="bg-cards hover:bg-cards/90 transition-colors glassomorphism shadow-2xl rounded-full w-full aspect-square centralize"
          >
            <ArrowLeft />
          </Link>
        </div>
        <div className="h-full aspect-square  rounded-br-none rounded-full round-right"></div>
      </div>
    </>
  );
}
