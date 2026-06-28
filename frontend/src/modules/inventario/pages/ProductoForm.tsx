import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCrearProducto, useActualizarProducto, useProducto } from "../services/productos.api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "@/shared/components/BackButton";
import Loading from "@/shared/components/Loading";
import { useEffect } from "react";
import { Save, X } from "lucide-react";

const productCodeRegex = /^[A-Za-z0-9_-]{3,30}$/;
const barcodeRegex = /^\d{8,14}$/;

const schema = z.object({
  code: z
    .string()
    .min(1, "El código de producto es requerido")
    .refine((v) => productCodeRegex.test(v.trim()), {
      message: "Usa 3-30 caracteres: letras, números, guion (-) o guion bajo (_)"
    }),
  barcode: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || barcodeRegex.test(v), {
      message: "El código de barras debe tener solo dígitos (8 a 14)"
    }),
  name: z.string().min(1, "El nombre es requerido"),
  price: z.number().min(0, "El precio no puede ser negativo"),
  cost: z.number().min(0, "El costo no puede ser negativo"),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  minStock: z.number().min(0, "El stock mínimo no puede ser negativo"),
});

type FormValues = z.infer<typeof schema>;

export default function ProductoForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const productId = id ? parseInt(id, 10) : 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      barcode: "",
      name: "",
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
    },
  });

  const { mutateAsync: createProduct } = useCrearProducto();
  const { mutateAsync: updateProduct } = useActualizarProducto();
  const { data: product, isLoading } = useProducto(productId);
  const navigate = useNavigate();

  useEffect(() => {
    if (product && isEditing) {
      reset({
        code: product.code,
        barcode: product.barcode ?? "",
        name: product.name,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        minStock: product.minStock ?? 0,
      });
    }
  }, [product, isEditing, reset]);

  const onSubmit = async (v: FormValues) => {
    try {
      const payload = {
        ...v,
        code: v.code.trim().toUpperCase(),
        barcode: v.barcode?.trim() ? v.barcode.trim() : null,
      };

      if (isEditing) {
        await updateProduct({ id: productId, data: payload });
        toast.success("Producto actualizado exitosamente");
      } else {
        await createProduct(payload);
        toast.success("Producto creado exitosamente");
      }
      reset();
      navigate("/inventario");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al guardar producto");
    }
  };

  if (isEditing && isLoading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton to="/inventario" />
      <div className="space-y-3 rounded border border-slate-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-neutral-100">
          {isEditing ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Código de producto</span>
              <input
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("code")}
                placeholder="PRD-001"
              />
              <small className="text-xs text-slate-500 dark:text-slate-400">Único. 3-30 caracteres: letras, números, - o _.</small>
              {errors.code && <small className="text-red-500">{errors.code.message}</small>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Código de barras (opcional)</span>
              <input
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("barcode")}
                placeholder="7501031311309"
              />
              <small className="text-xs text-slate-500 dark:text-slate-400">Único. Solo dígitos de 8 a 14.</small>
              {errors.barcode && <small className="text-red-500">{errors.barcode.message}</small>}
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Nombre</span>
              <input
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("name")}
                placeholder="Producto de ejemplo"
              />
              {errors.name && <small className="text-red-500">{errors.name.message}</small>}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Precio</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.price && <small className="text-red-500">{errors.price.message}</small>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Costo</span>
              <input
                type="number"
                step="0.01"
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("cost", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.cost && <small className="text-red-500">{errors.cost.message}</small>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Stock (opcional)</span>
              <input
                type="number"
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && <small className="text-red-500">{errors.stock.message}</small>}
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Stock Mínimo (opcional)</span>
              <input
                type="number"
                className="rounded border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
                {...register("minStock", { valueAsNumber: true })}
                placeholder="0"
              />
              <small className="text-xs text-slate-500 dark:text-slate-400">Unidades que activan alerta de stock bajo. Defecto: 0</small>
              {errors.minStock && <small className="text-red-500">{errors.minStock.message}</small>}
            </label>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-vixo-500 hover:bg-vixo-600 active:bg-vixo-700 px-4 py-2 text-white font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/inventario")}
              className="rounded border border-slate-300 dark:border-neutral-600 px-4 py-2 text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 flex items-center gap-2"
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
