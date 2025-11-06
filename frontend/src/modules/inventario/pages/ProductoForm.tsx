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
      <div className="space-y-3 rounded border bg-white p-6 shadow">
        <h2 className="text-2xl font-bold">Nuevo Producto</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Código</span>
              <input
                className="rounded border p-2 focus:border-neutral-900 focus:outline-none"
                {...register("codigo")}
                placeholder="PRD-001"
              />
              {errors.codigo && (
                <small className="text-red-600">{errors.codigo.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium">Nombre</span>
              <input
                className="rounded border p-2 focus:border-neutral-900 focus:outline-none"
                {...register("nombre")}
                placeholder="Producto de ejemplo"
              />
              {errors.nombre && (
                <small className="text-red-600">{errors.nombre.message}</small>
              )}
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Precio</span>
              <input
                type="number"
                step="0.01"
                className="rounded border p-2 focus:border-neutral-900 focus:outline-none"
                {...register("precio")}
                placeholder="0.00"
              />
              {errors.precio && (
                <small className="text-red-600">{errors.precio.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium">Costo</span>
              <input
                type="number"
                step="0.01"
                className="rounded border p-2 focus:border-neutral-900 focus:outline-none"
                {...register("costo")}
                placeholder="0.00"
              />
              {errors.costo && (
                <small className="text-red-600">{errors.costo.message}</small>
              )}
            </label>
            
            <label className="grid gap-1">
              <span className="text-sm font-medium">Stock (opcional)</span>
              <input
                type="number"
                className="rounded border p-2 focus:border-neutral-900 focus:outline-none"
                {...register("stock")}
                placeholder="0"
              />
              {errors.stock && (
                <small className="text-red-600">{errors.stock.message}</small>
              )}
            </label>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-neutral-900 px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/inventario")}
              className="rounded border px-4 py-2 hover:bg-neutral-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
