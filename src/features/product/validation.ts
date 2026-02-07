import { z } from "zod";

export const productSchema = z.object({
  barcode: z
    .string()
    .min(6, "El código de barras debe tener al menos 6 caracteres")
    .max(13, "El código de barras no puede tener más de 13 caracteres")
    .regex(/^\d+$/, "El código de barras debe contener solo dígitos"),
});
