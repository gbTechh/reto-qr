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
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  // 1. CORRECCIÓN: Definimos stopScanner ANTES del useEffect para evitar el error de "accessed before initialization"
  // Usamos useCallback para que sea estable y no rompa el array de dependencias
  const stopScanner = useCallback(async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner", err);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Limpiar mensaje de error al abrir
      setErrorMessage(null);

      const timer = setTimeout(async () => {
        const element = document.getElementById("reader");
        if (!element) return;

        // Limpiamos instancia previa si existe por seguridad
        if (scannerRef.current) {
          try {
            await stopScanner();
          } catch (e) {}
        }

        // Verificar que el navegador soporte getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setErrorMessage(
            "Tu navegador no soporta acceso a la cámara. Por favor, usa un navegador moderno.",
          );
          console.warn("El navegador no soporta getUserMedia");
          return;
        }

        // Verificar que hay cámaras disponibles
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const cameras = devices.filter(
            (device) => device.kind === "videoinput",
          );

          if (cameras.length === 0) {
            setErrorMessage(
              "No se encontró ninguna cámara en este dispositivo.",
            );
            console.warn("No hay cámaras disponibles en el dispositivo");
            return;
          }
        } catch (e) {
          setErrorMessage("Error al verificar las cámaras disponibles.");
          console.warn("Error al enumerar dispositivos:", e);
          return;
        }

        // 2. CORRECCIÓN: 'formatsToSupport' se pasa AQUÍ, en el constructor
        const scanner = new Html5Qrcode("reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.QR_CODE,
          ],
          verbose: false,
        });

        scannerRef.current = scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        const onScan = (decodedText: string) => {
          onScanSuccess(decodedText);
          onOpenChange(false);
          stopScanner();
        };

        // Intentar iniciar cámara con diferentes estrategias
        try {
          // Estrategia 1: Usar facingMode ideal (no exact) - más flexible
          await scanner.start(
            { facingMode: { ideal: facingMode } },
            config,
            onScan,
            () => {},
          );
        } catch (err) {
          console.warn(
            "No se pudo usar facingMode ideal, intentando sin restricciones:",
            err,
          );

          try {
            // Estrategia 2: Sin especificar facingMode - usa la cámara por defecto
            await scanner.start({}, config, onScan, () => {});
          } catch (e) {
            // Estrategia 3: Intentar con un deviceId específico de la primera cámara encontrada
            try {
              const devices = await navigator.mediaDevices.enumerateDevices();
              const cameras = devices.filter(
                (device) => device.kind === "videoinput",
              );

              if (cameras.length > 0 && cameras[0].deviceId) {
                await scanner.start(
                  { deviceId: { exact: cameras[0].deviceId } },
                  config,
                  onScan,
                  () => {},
                );
              } else {
                throw new Error("No se pudo identificar una cámara válida");
              }
            } catch (finalError) {
              setErrorMessage(
                "No se pudo acceder a la cámara. Por favor, verifica los permisos en tu navegador.",
              );
              console.warn("Error al iniciar cámara:", finalError);
            }
          }
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        // Importante: No llamamos a stopScanner() aquí directamente si el componente se desmonta
        // porque puede causar promesas pendientes, pero intentamos limpiar lo posible.
        if (scannerRef.current?.isScanning) {
          scannerRef.current.stop().catch(console.error);
        }
      };
    }
  }, [isOpen, facingMode, onOpenChange, onScanSuccess, stopScanner]);

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
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
          <div className="w-full max-w-md mx-auto p-6 bg-destructive/10 border border-destructive/30 rounded-2xl">
            <Text color="grey" size="sm" className="text-center">
              ⚠️ {errorMessage}
            </Text>
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
