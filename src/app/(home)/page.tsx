"use client";

import { ButtonHistorial } from "@/components/atoms/ButtonHistorial";
import { Text } from "@/components/atoms/Text";
import { FlowField } from "@/components/molecules/FlowField";
import { ScannerDrawer } from "@/components/molecules/ScannerDrawer";
import { ManualSearch } from "@/components/organism/ManualSearch";
import { ProductDetailSheet } from "@/components/organism/ProductDetailSheet";
import { useProductStore } from "@/features/product/store";
import { useProductQuery } from "@/shared/hooks/useProductQuery";
import { QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { data, isLoading, isError } = useProductQuery(scannedCode);
  const openOnlySheet = useProductStore((s) => s.openOnlySheet);
  const addToHistory = useProductStore((s) => s.addToHistory);

  const handleScanSuccess = (code: string) => {
    setScannedCode(code);
  };

  useEffect(() => {
    if (data) {
      openOnlySheet(data);

      const timer = setTimeout(() => {
        addToHistory(data);
        setScannedCode(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [data, openOnlySheet, addToHistory]);

  useEffect(() => {
    if (isError) {
      toast.error("Producto no encontrado", {
        description: `El código ${scannedCode} no está registrado en el sistema.`,
      });
    }
  }, [isError, scannedCode]);

  return (
    <>
      <section className="centralize flex-col gap-6 md:gap-10 pt-14 relative flex-1">
        <div className="centralize w-full px-10">
          <ButtonHistorial />
        </div>
        <div className="centralize w-full centralize px-10">
          <div className="aspect-square w-full max-w-[220px]">
            <FlowField isScanning={isScannerOpen || isLoading} />
          </div>
        </div>
        <div className="centralize w-full centralize flex-col gap-4 px-10 text-center">
          <Text size={"big"} as="h1" variant={"title"}>
            Bienvenido a QrScanner
          </Text>
          <Text size={"md"} variant={"base"} as="p" color={"contrast"}>
            Explora productos a solo un click.
          </Text>
        </div>
        <div>
          <ManualSearch />
          <ProductDetailSheet />
        </div>
      </section>
      {/* bottom busqueda */}
      <div className="w-full h-20 absolute bottom-0 left-0 flex items-end justify-center">
        <div className="h-full aspect-square  rounded-bl-none rounded-full round-left"></div>
        <div className="runded-t-full bg-white w-14 h-full rounded-t-full p-1 z-10">
          <button
            onClick={() => {
              setScannedCode(null);
              setIsScannerOpen(true);
            }}
            className="bg-cards hover:bg-cards/90 transition-colors glassomorphism shadow-2xl rounded-full w-full aspect-square centralize"
          >
            <QrCode />
          </button>
        </div>
        <div className="h-full aspect-square  rounded-br-none rounded-full round-right"></div>
      </div>
      <ScannerDrawer
        isOpen={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
}
