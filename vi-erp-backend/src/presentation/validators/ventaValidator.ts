import { z } from "zod";

export const crearVentaSchema = z.object({
  clienteId: z.number().int().positive("El ID del cliente debe ser un número positivo"),
  productos: z.array(
    z.object({
      id: z.number().int().positive("El ID del producto debe ser un número positivo"),
      cantidad: z.number().int().positive("La cantidad debe ser un número positivo"),
      precio: z.number().positive("El precio debe ser un número positivo"),
    })
  ).min(1, "Debe incluir al menos un producto"),
});

export type CrearVentaInput = z.infer<typeof crearVentaSchema>;
