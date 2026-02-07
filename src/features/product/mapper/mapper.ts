import { IProduct } from "../types";

export interface ProductResponse {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  category: string;
}

export const mappedResponseProductsData = (data: IProduct): ProductResponse => {
  return {
    id: data.id,
    name: data.name || "Producto sin nombre",
    brand: data.brand || "Marca genérica",
    image: data.image || "/placeholder-product.png",
    price: generateMockPrice(data.id),
    category: data.category || "General",
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
