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
      const timer = setTimeout(() => {
        const element = document.getElementById("reader");
        if (!element) return;

        scanner = new Html5QrcodeScanner(
          "reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
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
      <SheetContent
        side="top"
        className="max-h-[70dvh] rounded-b-3xl border-0 bg-transparent p-0 pb-2 gap-3"
      >
        <SheetHeader className="bg-card rounded-b-2xl">
          <SheetTitle className="flex items-center gap-2 border-b pb-2">
            <QrCode className="w-5 h-5 text-primary" />
            <Text variant="title" size="md">
              Escanear Producto
            </Text>
          </SheetTitle>

          <div className="text-center px-6 bg-card pt-2 ">
            <Text color="grey" size="sm">
              Ubica el código de barras dentro del recuadro.
            </Text>
          </div>
        </SheetHeader>

        <div
          id="reader"
          className="w-full max-w-[250px] aspect-square mx-auto overflow-hidden rounded-2xl border border-dashed border-primary/30"
        />
      </SheetContent>
    </Sheet>
  );
};
