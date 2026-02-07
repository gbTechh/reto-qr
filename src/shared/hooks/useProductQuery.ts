"use client";

import { getProductAction } from "@/features/product/actions";
import { useQuery } from "@tanstack/react-query";

export const useProductQuery = (barcode: string | null) => {
  return useQuery({
    queryKey: ["product", barcode],

    queryFn: async () => {
      const result = await getProductAction(barcode!);

      if (!result.success) {
        throw new Error(result.error || "Error desconocido");
      }

      return result.data;
    },

    enabled: !!barcode && barcode.length >= 6 && barcode.length <= 13,

    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
