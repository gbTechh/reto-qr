"use client";

import { getProductAction } from "@/features/product/actions";
import { useQuery } from "@tanstack/react-query";

export const useProductQuery = (barcode: string | null) => {
  return useQuery({
    queryKey: ["product", barcode],

    queryFn: () => getProductAction(barcode!),

    enabled: !!barcode && barcode.length >= 6 && barcode.length <= 13,

    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
