import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser, useUpdateUser, useUser } from "../services/users.api";
import { useRoles } from "../services/roles.api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { Save, X, KeyRound } from "lucide-react";

const createSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

const editSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  role: z.string().optional(),
  isActive: z.boolean().optional(),
});

type CreateFormValues = z.infer<typeof createSchema>;
type EditFormValues = z.infer<typeof editSchema>;
type FormValues = CreateFormValues | EditFormValues;

export default function UserForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: user, isLoading: isLoadingUser } = useUser(id ? parseInt(id) : 0);
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<any>({
    resolver: zodResolver(isEditing ? editSchema : createSchema),
    defaultValues: {
      isActive: true,
    },
  });

  useEffect(() => {
    if (user && isEditing) {
      reset({
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      });
      if (user.roles) {
        setSelectedRoles(user.roles.map((r) => r.id));
      }
    }
  }, [user, isEditing, reset]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showResetPassword) {
        setShowResetPassword(false);
        setNewPassword("");
        setConfirmPassword("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showResetPassword]);

  const handleRoleToggle = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const data = {
        ...values,
        roleIds: selectedRoles,
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: parseInt(id), data });
        toast.success("Usuario actualizado exitosamente");
      } else {
        await createMutation.mutateAsync(data as any);
        toast.success("Usuario creado exitosamente");
      }
      navigate("/mantenimientos/usuarios");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al guardar usuario");
    }
  };

  const handleResetPassword = async () => {
    if (!id) return;
    
    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: parseInt(id),
        data: { password: newPassword },
      });
      toast.success("Contraseña actualizada exitosamente");
      setShowResetPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al actualizar contraseña");
    }
  };

  if (isEditing && isLoadingUser) return <Loading />;
  if (isLoadingRoles) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton to="/mantenimientos/usuarios" />
      <div className="space-y-3 rounded border border-beige-arena dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gris-piedra dark:text-neutral-100">
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={() => setShowResetPassword(true)}
              className="rounded border border-beige-arena dark:border-neutral-600 px-3 py-1.5 text-sm text-gris-piedra dark:text-neutral-300 hover:bg-beige-arena dark:hover:bg-neutral-700 flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Resetear contraseña
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Nombre</span>
              <input
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("name")}
                placeholder="Juan Pérez"
              />
              {errors.name && <small className="text-terracota">{String(errors.name.message)}</small>}
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Email</span>
              <input
                type="email"
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("email")}
                placeholder="juan@example.com"
              />
              {errors.email && <small className="text-terracota">{String(errors.email.message)}</small>}
            </label>
          </div>

          {!isEditing && (
            <label className="grid gap-1">
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">
                Contraseña
              </span>
              <input
                type="password"
                className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                {...register("password")}
                placeholder="••••••"
              />
              {errors.password && <small className="text-terracota">{String(errors.password.message)}</small>}
            </label>
          )}

          <div className="space-y-2">
            <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Roles</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center gap-2 p-2 rounded border border-beige-arena dark:border-neutral-600 cursor-pointer hover:bg-beige-arena dark:hover:bg-neutral-700">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="h-4 w-4"
                  />
                  <div>
                    <div className="text-sm font-medium text-gris-piedra dark:text-neutral-100">{role.name}</div>
                    {role.description && (
                      <div className="text-xs text-gris-piedra dark:text-neutral-400 opacity-75">
                        {role.description}
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
              <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">Usuario activo</span>
            </label>
          )}

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
              onClick={() => navigate("/mantenimientos/usuarios")}
              className="rounded border border-beige-arena dark:border-neutral-600 px-4 py-2 text-gris-piedra dark:text-neutral-300 hover:bg-beige-arena dark:hover:bg-neutral-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Modal de reseteo de contraseña */}
      {showResetPassword && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowResetPassword(false);
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          <div 
            className="bg-white dark:bg-neutral-800 border border-beige-arena dark:border-neutral-700 rounded-xl p-6 shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gris-piedra dark:text-neutral-100 mb-4">
              Resetear contraseña
            </h3>

            <div className="space-y-4">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">
                  Nueva contraseña
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                  placeholder="••••••"
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-gris-piedra dark:text-neutral-300">
                  Confirmar contraseña
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded border border-beige-arena dark:border-neutral-600 bg-white dark:bg-neutral-700 text-gris-piedra dark:text-neutral-100 p-2 focus:outline-none focus:ring-2 focus:ring-oliva"
                  placeholder="••••••"
                />
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleResetPassword}
                  disabled={updateMutation.isPending}
                  className="flex-1 rounded bg-oliva px-4 py-2 text-marfil hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updateMutation.isPending ? "Guardando..." : "Actualizar"}
                </button>
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="rounded border border-beige-arena dark:border-neutral-600 px-4 py-2 text-gris-piedra dark:text-neutral-300 hover:bg-beige-arena dark:hover:bg-neutral-700 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
