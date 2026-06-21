import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole, useUpdateRole, useRole, useAssignPermissions } from "../services/roles.api";
import { usePermissions } from "../services/permissions.api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { Save, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function RoleForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const { data: role, isLoading: isLoadingRole } = useRole(id ? parseInt(id) : 0);
  const { data: permissions = [], isLoading: isLoadingPermissions } = usePermissions();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const assignPermissionsMutation = useAssignPermissions();

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
    if (role && isEditing) {
      reset({
        name: role.name,
        description: role.description || "",
        isActive: role.isActive,
      });
      if (role.permissions) {
        setSelectedPermissions(role.permissions.map((p) => p.id));
      }
    }
  }, [role, isEditing, reset]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: parseInt(id), data: values });
        // Update permissions separately
        await assignPermissionsMutation.mutateAsync({ 
          roleId: parseInt(id), 
          permissionIds: selectedPermissions 
        });
        toast.success("Rol actualizado exitosamente");
      } else {
        const newRole = await createMutation.mutateAsync(values);
        // Assign permissions to new role
        if (selectedPermissions.length > 0) {
          await assignPermissionsMutation.mutateAsync({ 
            roleId: newRole.id, 
            permissionIds: selectedPermissions 
          });
        }
        toast.success("Rol creado exitosamente");
      }
      navigate("/mantenimientos/roles");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error.message ?? "Error al guardar rol");
    }
  };

  if (isEditing && isLoadingRole) return <Loading />;
  if (isLoadingPermissions) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton to="/mantenimientos/roles" />
      <div className="space-y-3 rounded border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-neutral-100">
          {isEditing ? "Editar Rol" : "Nuevo Rol"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Nombre</span>
            <input
              className="rounded border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
              {...register("name")}
              placeholder="Administrador"
            />
            {errors.name && <small className="text-red-600 dark:text-red-400">{errors.name.message}</small>}
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Descripción</span>
            <textarea
              className="rounded border border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-700 dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-vixo-500"
              {...register("description")}
              placeholder="Descripción del rol"
              rows={3}
            />
            {errors.description && <small className="text-red-600 dark:text-red-400">{errors.description.message}</small>}
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Permisos</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 border border-slate-200 dark:border-neutral-600 rounded">
              {permissions.map((permission: { id: number; name: string; description?: string }) => (
                <label
                  key={permission.id}
                  className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-neutral-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="text-sm text-slate-700 dark:text-neutral-100">{permission.name}</div>
                    {permission.description && (
                      <div className="text-xs text-slate-700 dark:text-neutral-400 opacity-75">
                        {permission.description}
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {isEditing && (
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
              <span className="text-sm font-medium text-slate-700 dark:text-neutral-300">Rol activo</span>
            </label>
          )}

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
              onClick={() => navigate("/mantenimientos/roles")}
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
