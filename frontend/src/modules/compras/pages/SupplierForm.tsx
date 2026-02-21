import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateSupplier, useUpdateSupplier, useSupplier } from "../services/suppliers.api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "@/shared/components/Loading";
import { Save, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  adress: z.string().optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SupplierForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: supplier, isLoading } = useSupplier(id ? parseInt(id) : 0);
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (supplier && isEditing) {
      reset({
        name: supplier.name,
        phone: supplier.phone || "",
        email: supplier.email || "",
        adress: supplier.adress || "",
        isActive: supplier.isActive,
      });
    }
  }, [supplier, isEditing, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: parseInt(id), data: values });
        toast.success("Proveedor actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Proveedor creado exitosamente");
      }
      navigate("/compras/proveedores");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al guardar proveedor");
    }
  };

  if (isEditing && isLoading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {isEditing ? "Editar Proveedor" : "Nuevo Proveedor"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre *</span>
            <input
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              {...register("name")}
              placeholder="Distribuidora ABC"
            />
            {errors.name && <small className="text-red-600 dark:text-red-400">{String(errors.name.message)}</small>}
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Teléfono</span>
              <input
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                {...register("phone")}
                placeholder="+51 999 888 777"
              />
              {errors.phone && <small className="text-red-600 dark:text-red-400">{String(errors.phone.message)}</small>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
              <input
                type="email"
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                {...register("email")}
                placeholder="contacto@proveedor.com"
              />
              {errors.email && <small className="text-red-600 dark:text-red-400">{String(errors.email.message)}</small>}
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dirección</span>
            <textarea
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              {...register("adress")}
              placeholder="Av. Principal 123, Lima"
              rows={2}
            />
            {errors.adress && <small className="text-red-600 dark:text-red-400">{String(errors.adress.message)}</small>}
          </label>

          {isEditing && (
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-vixo-500 focus:ring-vixo-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Proveedor activo</span>
            </label>
          )}

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-vixo-500 hover:bg-vixo-600 px-4 py-2.5 text-white font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/compras/proveedores")}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors"
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
