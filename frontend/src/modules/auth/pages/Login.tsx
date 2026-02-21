import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginApi } from "../services/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mail, Lock, LogIn } from "lucide-react";

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
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vixo-50 to-white dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="w-full max-w-md">
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            
            <div className="text-center">
              <img src="/Vixo Claro.svg" alt="Vixo logo" className="h-30 w-60 mx-auto" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Inicia sesión para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                  placeholder="tu@correo.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contraseña</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-vixo-500 focus:border-vixo-500 transition-colors"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-vixo-500 focus:ring-vixo-500" />
                <span className="ml-2 text-slate-700 dark:text-slate-300">Recordarme</span>
              </label>
              <Link to="#" className="text-sm text-vixo-600 dark:text-vixo-400 hover:text-vixo-700 dark:hover:text-vixo-300 font-medium">¿Olvidaste tu contraseña?</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-vixo-500 hover:bg-vixo-600 text-white py-2.5 px-4 font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            ¿No tienes cuenta? <Link to="#" className="text-vixo-600 dark:text-vixo-400 font-medium hover:text-vixo-700 dark:hover:text-vixo-300">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
