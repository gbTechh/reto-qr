"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/shared/components/atoms/Text";
import { useProductQuery } from "@/shared/hooks/useProductQuery";
import { productSchema } from "@/features/product/validation";
import { useProductStore } from "@/features/product/store";
import { AlertError } from "../atoms/AlertError";

export const ManualSearch = () => {
  const [barcode, setBarcode] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useProductQuery(searchId);
  const openOnlySheet = useProductStore((s) => s.openOnlySheet);
  const addToHistory = useProductStore((s) => s.addToHistory);

  const displayError = validationError
    ? validationError
    : isError && error instanceof Error
      ? error.message
      : null;

  useEffect(() => {
    if (data) {
      openOnlySheet(data);
      const timer = setTimeout(() => {
        addToHistory(data);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [data, addToHistory, openOnlySheet]);

  const handleSearch = () => {
    setValidationError(null);
    const result = productSchema.safeParse({ barcode });
    if (!result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }
    if (barcode === searchId && data) {
      openOnlySheet(data);
      return;
    }
    setSearchId(barcode);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-full gap-2">
            <Search className="w-4 h-4" />
            Ingresar código manual
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <Text variant="title" size="md">
                Búsqueda Manual
              </Text>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {displayError && (
              <AlertError
                title="Ha ocurrido un problema"
                message={displayError}
              />
            )}

            <Text color="grey" size="sm">
              Digita los 13 números del código de barras del producto.
            </Text>
            <Input
              placeholder="Ej: 7501055363803"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              type="text"
              className="text-lg py-6"
            />
            <Button
              onClick={handleSearch}
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Buscando..." : "Buscar Producto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
