"use client";

import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/components/ui/sheet";
import { QrCode, Camera, AlertCircle } from "lucide-react";
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
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  // Get available cameras
  useEffect(() => {
    if (isOpen) {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length > 0) {
            const cameraList = devices.map((device) => ({
              id: device.id,
              label: device.label || `Camera ${device.id}`,
            }));
            setCameras(cameraList);
            // Select back camera by default (usually the last one on mobile)
            setSelectedCameraId(cameraList[cameraList.length - 1].id);
          } else {
            setError("No se encontraron cámaras disponibles");
          }
        })
        .catch((err) => {
          console.error("Error getting cameras:", err);
          setError("Error al acceder a las cámaras");
        });
    }
  }, [isOpen]);

  // Start scanning when camera is selected
  useEffect(() => {
    if (!isOpen || !selectedCameraId) return;

    let html5QrCode: Html5Qrcode | null = null;

    const startScanning = async () => {
      try {
        setError(null);
        html5QrCode = new Html5Qrcode("reader");
        setScanner(html5QrCode);

        await html5QrCode.start(
          selectedCameraId,
          {
            fps: 10,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Success callback
            onScanSuccess(decodedText);
            onOpenChange(false);
          },
          () => {
            // Error callback (we can ignore scan errors)
          },
        );

        setIsScanning(true);
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError(
          "Error al iniciar el escáner. Por favor, da permiso a la cámara.",
        );
        setIsScanning(false);
      }
    };

    const timer = setTimeout(startScanning, 200);

    return () => {
      clearTimeout(timer);
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .then(() => {
            html5QrCode?.clear();
            setIsScanning(false);
            setScanner(null);
          })
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, [isOpen, selectedCameraId, onScanSuccess, onOpenChange]);

  const handleCameraChange = async (newCameraId: string) => {
    // Stop current scanner
    if (scanner && scanner.isScanning) {
      await scanner.stop();
      setIsScanning(false);
    }
    // Set new camera (useEffect will restart scanning)
    setSelectedCameraId(newCameraId);
  };

  const flipCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex(
      (cam) => cam.id === selectedCameraId,
    );
    const nextIndex = (currentIndex + 1) % cameras.length;
    handleCameraChange(cameras[nextIndex].id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="top"
        className="max-h-[80dvh] rounded-b-3xl bg-transparent p-0 pb-4"
      >
        <SheetHeader className="bg-card rounded-b-3xl">
          <SheetTitle className="flex items-center gap-2 border-b pb-4">
            <QrCode className="w-5 h-5 text-primary" />
            <Text variant="title" size="md">
              Escanear Producto
            </Text>
          </SheetTitle>

          <div className="text-center px-6 bg-card pt-2 pb-4">
            <Text color="grey" size="sm">
              Ubica el código de barras dentro del recuadro para identificar el
              producto automáticamente.
            </Text>
          </div>

          {/* Camera Controls - Outside scan area */}
          <div className="px-4 pb-3 space-y-2 bg-card">
            {cameras.length > 1 && (
              <Button
                onClick={flipCamera}
                variant="outline"
                className="w-full gap-2"
                disabled={!isScanning}
              >
                <Camera className="w-4 h-4" />
                Cambiar Cámara
              </Button>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <Text size="sm" className="text-destructive">
                  {error}
                </Text>
              </div>
            )}
          </div>
        </SheetHeader>

        {/* Scan Area - Matches FlowField size */}
        <div
          id="reader"
          className="w-full max-w-[220px] aspect-square mx-auto overflow-hidden rounded-2xl border-2 border-dashed border-primary/30 bg-black/10"
        />
      </SheetContent>
    </Sheet>
  );
};
