import { z } from "zod";

export const createSaleSchema = z.object({
  customerId: z.number().int().positive("Customer ID must be a positive number"),
  products: z.array(
    z.object({
      id: z.number().int().positive("Product ID must be a positive number"),
      quantity: z.number().int().positive("Quantity must be a positive number"),
      price: z.number().positive("Price must be a positive number"),
    })
  ).min(1, "Must include at least one product"),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
