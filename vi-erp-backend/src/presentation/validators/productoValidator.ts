import { z } from "zod";

const productCodeRegex = /^[A-Za-z0-9_-]{3,30}$/;
const barcodeRegex = /^\d{8,14}$/;

const normalizeCode = (value: string) => value.trim().toUpperCase();
const normalizeBarcode = (value: string | undefined | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

export const createProductSchema = z.object({
  code: z
    .string()
    .min(1, "El código de producto es requerido")
    .transform(normalizeCode)
    .refine((value) => productCodeRegex.test(value), {
      message:
        "El código de producto debe tener 3-30 caracteres y solo usar letras, números, guion (-) o guion bajo (_)"
    }),
  barcode: z
    .string()
    .optional()
    .nullable()
    .transform((value) => normalizeBarcode(value))
    .refine((value) => value === null || barcodeRegex.test(value), {
      message: "El código de barras debe contener solo dígitos (8 a 14)"
    }),
  name: z.string().min(1, "El nombre es requerido").transform((value) => value.trim()),
  price: z.number().min(0, "El precio no puede ser negativo"),
  cost: z.number().min(0, "El costo no puede ser negativo"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  minStock: z.number().min(0, "El stock mínimo no puede ser negativo").default(0),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
