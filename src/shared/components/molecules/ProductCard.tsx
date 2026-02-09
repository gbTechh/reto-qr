import { IProduct } from "@/features/product/types";
import { Card, CardFooter, CardHeader } from "../ui/card";
import { Text } from "../atoms/Text";
import { ProductImage } from "./ProductImage";
import { ChevronRight, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useProductStore } from "@/features/product/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export const ProductCard = ({ product }: { product: IProduct }) => {
  const removeFromHistory = useProductStore((s) => s.removeFromHistory);
  const openOnlySheet = useProductStore((s) => s.openOnlySheet);
  return (
    <Card className="mx-auto w-full max-w-sm product-detail-content">
      <CardHeader className="gap-1">
        <div className="flex flex-row gap-4 justify-between items-start">
          <div className="aspect-square min-w-[50px] w-full max-w-[95px] ">
            <ProductImage
              src={product.image}
              alt={product.name}
              rounded="rounded-lg"
              w={90}
              h={90}
            />
          </div>
          <div className="flex flex-col w-2/3 flex-1 gap-3 justify-between items-end h-full">
            <div className="flex items-start gap-2 justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Eliminar del historial?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción quitará a <strong>{product.name}</strong> de
                      tu lista de productos recientes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => removeFromHistory(product.id)}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex gap-1 flex-col items-end">
              <Text
                variant={"title"}
                color={"grey"}
                size={"sm"}
                className="font-extrabold"
              >
                Precio
              </Text>
              <Text
                variant={"title"}
                color={"primary"}
                size={"xl"}
                className="font-extrabold"
              >
                S/.{product.price}
              </Text>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardFooter>
        <div className="flex flex-col flex-1 gap-3">
          <Text size={"md"} variant={"subtitle"} className="capitalize">
            {product.name}
          </Text>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => openOnlySheet(product)}
          >
            Ver detalles
            <ChevronRight />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
