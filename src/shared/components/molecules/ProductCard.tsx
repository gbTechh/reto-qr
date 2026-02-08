import { IProduct } from "@/features/product/types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Text } from "../atoms/Text";
import { ProductImage } from "./ProductImage";
import { ChevronRight, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useProductStore } from "@/features/product/store";

// Este componente se reinicia solo gracias a la prop 'key'
export const ProductCard = ({ product }: { product: IProduct }) => {
  const openOnlySheet = useProductStore((s) => s.openOnlySheet);
  return (
    <Card className="mx-auto w-full max-w-sm">
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
              <Button
                variant="secondary"
                color="danger"
                size="icon"
                className="rounded-full"
              >
                <Trash />
              </Button>
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
