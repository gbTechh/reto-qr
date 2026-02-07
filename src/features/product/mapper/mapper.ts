import { IOpenFoodFactsResponse, IProduct } from "../types";

export const mappedResponseProductsData = (
  data: IOpenFoodFactsResponse,
): IProduct => {
  return {
    id: data.code,
    name: data.product?.product_name || "Producto sin nombre",
    brand: data.product?.brands || "Marca genérica",
    image: data.product?.image_front_small_url || "/placeholder-product.png",
    price: generateMockPrice(data.code),
    category:
      data.product?.categories_tags?.[0].replace("en:", "") || "General",
  };
};

// Función auxiliar (puedes dejarla aquí o en utils)
function generateMockPrice(barcode: string): number {
  const seed = barcode
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = Math.abs(Math.sin(seed));
  const price = 5 + random * 145;
  return Number(price.toFixed(2));
}
