"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { QrCode } from "lucide-react";
import { Text } from "../atoms/Text";

interface ScannerDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (barcode: string) => void;
}

export const ScannerDrawer = ({
  isOpen,
  onOpenChange,
  onScanSuccess,
}: ScannerDrawerProps) => {
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isOpen) {
      // Usamos un timeout corto para asegurar que el DOM de Shadcn ya esté montado
      const timer = setTimeout(() => {
        const element = document.getElementById("reader");
        if (!element) return; // Evitamos el crash si aún no existe

        scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.QR_CODE,
            ],
          },
          false,
        );

        scanner.render(
          (decodedText) => {
            onScanSuccess(decodedText);
            onOpenChange(false);
            scanner?.clear();
          },
          () => {},
        );
      }, 300); // 300ms suele ser suficiente para la animación de apertura

      return () => {
        clearTimeout(timer);
        if (scanner) {
          scanner.clear().catch(console.error);
        }
      };
    }
  }, [isOpen, onOpenChange, onScanSuccess]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 justify-center pb-4 border-b">
            <QrCode className="w-5 h-5 text-primary" />
            <Text variant="title" size="md">
              Escanear Producto
            </Text>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center justify-center h-full gap-6">
          <div
            id="reader"
            className="w-full max-w-[350px] overflow-hidden rounded-2xl border-2 border-dashed border-primary/30"
          />

          <div className="text-center px-6">
            <Text color="grey" size="sm">
              Ubica el código de barras dentro del recuadro para identificar el
              producto automáticamente.
            </Text>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
