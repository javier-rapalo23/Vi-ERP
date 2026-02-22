import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCrearProducto } from "../services/productos.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";import { Save, X } from "lucide-react";
const schema = z.object({
  code: z.string().min(1, "El código es requerido"),
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  cost: z.number().min(0, "El costo debe ser mayor a 0"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
});

type FormValues = z.infer<typeof schema>;

export default function ProductoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  
  const { mutateAsync } = useCrearProducto();
  const navigate = useNavigate();

  const onSubmit = async (v: FormValues) => {
    try {
      await mutateAsync(v);
      toast.success("Producto creado exitosamente");
      reset();
      navigate("/inventario");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al crear producto");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-3 rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gris-piedra dark:text-neutral-100">Nuevo Producto</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Código</span>
              <input
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("code")}
                placeholder="PRD-001"
              />
              {errors.code && (
                <small className="text-terracota">{errors.code.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Nombre</span>
              <input
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("name")}
                placeholder="Producto de ejemplo"
              />
              {errors.name && (
                <small className="text-terracota">{errors.name.message}</small>
              )}
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Precio</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && (
                <small className="text-terracota">{errors.price.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Costo</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("cost", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.cost && (
                <small className="text-terracota">{errors.cost.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Stock (opcional)</span>
              <input
                type="number"
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && (
                <small className="text-terracota">{errors.stock.message}</small>
              )}
            </label>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-oliva px-4 py-2 text-marfil hover:opacity-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/inventario")}
              className="rounded border border-beige-arena dark:border-neutral-600 px-4 py-2 text-gris-piedra dark:text-neutral-300 hover:bg-beige-arena dark:hover:bg-neutral-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
