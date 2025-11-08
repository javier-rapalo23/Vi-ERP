import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCrearProducto } from "../services/productos.api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  precio: z.number().min(0, "El precio debe ser mayor a 0"),
  costo: z.number().min(0, "El costo debe ser mayor a 0"),
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
      <div className="space-y-3 rounded border border-beige-arena bg-marfil p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gris-piedra">Nuevo Producto</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra">Código</span>
              <input
                className="rounded border border-beige-arena p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("codigo")}
                placeholder="PRD-001"
              />
              {errors.codigo && (
                <small className="text-terracota">{errors.codigo.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra">Nombre</span>
              <input
                className="rounded border border-beige-arena p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("nombre")}
                placeholder="Producto de ejemplo"
              />
              {errors.nombre && (
                <small className="text-terracota">{errors.nombre.message}</small>
              )}
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra">Precio</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-beige-arena p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("precio")}
                placeholder="0.00"
              />
              {errors.precio && (
                <small className="text-terracota">{errors.precio.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra">Costo</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-beige-arena p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("costo")}
                placeholder="0.00"
              />
              {errors.costo && (
                <small className="text-terracota">{errors.costo.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra">Stock (opcional)</span>
              <input
                type="number"
                className="rounded border border-beige-arena p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("stock")}
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
              className="rounded bg-oliva px-4 py-2 text-marfil hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/inventario")}
              className="rounded border border-beige-arena px-4 py-2 text-gris-piedra hover:bg-marfil"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
