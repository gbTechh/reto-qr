"use client";
import { useState } from "react";
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

export const ManualSearch = () => {
  const [barcode, setBarcode] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);

  // Usamos el hook de React Query que definimos antes
  const { data, isLoading, isError } = useProductQuery(searchId);

  const handleSearch = () => {
    if (barcode.length >= 6) {
      setSearchId(barcode);
    }
  };

  console.log({ isError });
  console.log({ data });

  return (
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
          <Text color="grey" size="sm">
            Digita los 13 números del código de barras del producto.
          </Text>
          <Input
            placeholder="Ej: 7501055363803"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            type="number"
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
  );
};
