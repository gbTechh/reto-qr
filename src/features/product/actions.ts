// src/features/product/actions.ts
"use server";

import { ActionResponse } from "@/shared/utils/types";
import { IProduct } from "./types";
import { mappedResponseProductsData } from "./mapper";

export async function getProductAction(
  barcode: string,
): Promise<ActionResponse<IProduct>> {
  if (!/^\d{6,13}$/.test(barcode)) {
    return {
      success: false,
      error: "Formato de código inválido (6-13 dígitos)",
      code: "INVALID_FORMAT",
    };
  }

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { next: { revalidate: 3600 } },
    );

    if (!res.ok)
      return {
        success: false,
        error: "Error al conectar con la API",
        code: "SERVER_ERROR",
      };

    const data = await res.json();

    // 2. Validación de Existencia
    if (data.status === 0 || !data.product) {
      return {
        success: false,
        error: "Producto no encontrado en la base de datos",
        code: "NOT_FOUND",
      };
    }

    // const seed = parseInt(barcode.slice(-4)) || 50;
    // const simulatedPrice = (seed % 146) + 5;

    const responseProduct: IProduct = {
      id: data.code,
      name: data.product.product_name,
      brand: data.product.brands,
      image: data.product.image_front_small_url,
      category: data.product.categories_tags?.[0].replace("en:", ""),
    };

    return { success: true, data: mappedResponseProductsData(responseProduct) };
  } catch (e) {
    return {
      success: false,
      error:
        "Error inesperado en el servidor" +
        (e instanceof Error ? e.message : String(e)),
      code: "SERVER_ERROR",
    };
  }
}
