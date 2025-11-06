import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginApi } from "../services/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const onSubmit = async (v: FormValues) => {
    try {
      const data = await loginApi(v.email, v.password);
      login(data);
      toast.success("¡Bienvenido!");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? "Error de autenticación");
    }
  };

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-3 rounded border bg-white p-6 shadow"
      >
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full rounded border p-2 focus:border-neutral-900 focus:outline-none"
            {...register("email")}
            placeholder="tu@correo.com"
            type="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full rounded border p-2 focus:border-neutral-900 focus:outline-none"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <button
          disabled={isSubmitting}
          className="w-full rounded bg-neutral-900 p-2 text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
