"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { QrCode, SwitchCamera } from "lucide-react";
import { Text } from "../atoms/Text";
import { Button } from "../ui/button";

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
  const [desiredCamera, setDesiredCamera] = useState<"environment" | "user">(
    "environment",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs para mantener el control sin re-renderizar
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningRef = useRef<boolean>(false);

  // Función robusta para detener el scanner
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        isScanningRef.current = false;
      } catch (err) {
        console.warn("Scanner ya estaba detenido o falló al detenerse", err);
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    await stopScanner();

    if (!document.getElementById("reader")) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader", {
        verbose: false,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
      });
    }

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        throw new Error("No se encontraron cámaras");
      }

      let selectedDeviceId = devices[0].id;

      if (desiredCamera === "environment") {
        const backCamera = devices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("trasera") ||
            device.label.toLowerCase().includes("environment"),
        );
        selectedDeviceId = backCamera
          ? backCamera.id
          : devices[devices.length - 1].id;
      } else {
        const frontCamera = devices.find(
          (device) =>
            device.label.toLowerCase().includes("front") ||
            device.label.toLowerCase().includes("delantera") ||
            device.label.toLowerCase().includes("user"),
        );
        selectedDeviceId = frontCamera ? frontCamera.id : devices[0].id;
      }

      if (scannerRef.current) {
        await scannerRef.current.start(
          selectedDeviceId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            onScanSuccess(decodedText);
            onOpenChange(false);
            stopScanner();
          },
          () => {},
        );
        isScanningRef.current = true;
        setErrorMessage(null);
      }
    } catch (err) {
      console.warn("Error crítico al iniciar cámara:", err);
      setErrorMessage(
        "Error de cámara: " +
          (err instanceof Error ? err.message : "Desconocido"),
      );
    }
  }, [desiredCamera, onOpenChange, onScanSuccess, stopScanner]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        startScanner();
      }, 300);

      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    } else {
      stopScanner();
    }
  }, [isOpen, startScanner, stopScanner]);

  const handleSwitchCamera = () => {
    setDesiredCamera((prev) =>
      prev === "environment" ? "user" : "environment",
    );
  };

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

          <div className="text-center px-0 bg-card pt-1 flex gap-2 items-center justify-center">
            <Text color="grey" size="sm">
              Ubica el código de barras dentro del recuadro.
            </Text>
            <Button onClick={handleSwitchCamera} variant="outline" size="icon">
              <SwitchCamera className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>
        {errorMessage ? (
          <div className="w-full max-w-md mx-auto p-2 bg-destructive/20 border border-destructive/30 rounded-2xl flex flex-col items-center justify-center">
            <Text color="primary" size="sm" className="text-center">
              ⚠️ {errorMessage}
            </Text>
            <Button
              variant="link"
              className="text-white underline mt-1 h-auto p-0"
              onClick={() => startScanner()}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <div
            id="reader"
            className="w-full max-w-[210px] p-1 aspect-square mx-auto overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-black/10"
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
