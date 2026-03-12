import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCrearCliente, useActualizarCliente, useCliente } from "../services/clientes.api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "@/shared/components/Loading";
import BackButton from "@/shared/components/BackButton";
import { Save } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  adress: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ClienteForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { data: cliente, isLoading } = useCliente(id ? parseInt(id) : 0);
  const crearMutation = useCrearCliente();
  const actualizarMutation = useActualizarCliente();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (cliente && isEditing) {
      reset({
        name: cliente.name,
        phone: cliente.phone || "",
        email: cliente.email || "",
        adress: cliente.adress || "",
      });
    }
  }, [cliente, isEditing, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await actualizarMutation.mutateAsync({ id: parseInt(id), data: values });
        toast.success("Cliente actualizado exitosamente");
      } else {
        await crearMutation.mutateAsync(values);
        toast.success("Cliente creado exitosamente");
      }
      navigate("/ventas/clientes");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "Error al guardar cliente");
    }
  };

  if (isEditing && isLoading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton to="/ventas/clientes" />
      <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 mt-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre *</span>
            <input
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              {...register("name")}
              placeholder="Juan Pérez"
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
                placeholder="cliente@ejemplo.com"
              />
              {errors.email && <small className="text-red-600 dark:text-red-400">{String(errors.email.message)}</small>}
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dirección</span>
            <input
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 p-2.5 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
              {...register("adress")}
              placeholder="Av. Principal 123"
            />
            {errors.adress && <small className="text-red-600 dark:text-red-400">{String(errors.adress.message)}</small>}
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/ventas/clientes")}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-vixo-500 hover:bg-vixo-600 disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
