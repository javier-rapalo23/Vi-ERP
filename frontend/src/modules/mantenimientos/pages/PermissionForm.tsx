import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePermission, useUpdatePermission, usePermission } from "../services/permissions.api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { Save, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function PermissionForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: permission, isLoading } = usePermission(id ? parseInt(id) : 0);
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (permission && isEditing) {
      reset({
        name: permission.name,
        description: permission.description || "",
      });
    }
  }, [permission, isEditing, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: parseInt(id), data: values });
        toast.success("Permiso actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Permiso creado exitosamente");
      }
      navigate("/mantenimientos/permisos");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al guardar permiso");
    }
  };

  if (isEditing && isLoading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton to="/mantenimientos/permisos" />
      <div className="space-y-3 rounded border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-neutral-100">
          {isEditing ? "Editar Permiso" : "Nuevo Permiso"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Nombre</span>
            <input
              className="rounded border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
              {...register("name")}
              placeholder="crear_producto"
            />
            {errors.name && <small className="text-red-600 dark:text-red-400">{errors.name.message}</small>}
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Descripción</span>
            <textarea
              className="rounded border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
              {...register("description")}
              placeholder="Permite crear nuevos productos en el inventario"
              rows={3}
            />
            {errors.description && <small className="text-red-600 dark:text-red-400">{errors.description.message}</small>}
          </label>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-vixo-500 px-4 py-2 text-white hover:bg-vixo-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/mantenimientos/permisos")}
              className="rounded border border-slate-200 dark:border-neutral-600 px-4 py-2 text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 flex items-center gap-2 transition-colors"
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
