import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginApi } from "../services/auth.api";
import { useAuthStore } from "@/shared/store/auth.store";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  <div className="min-h-screen flex items-center justify-center bg-marfil py-12 px-4 text-gris-piedra">
      <div className="w-full max-w-md">
  <div className="bg-white border border-beige-arena rounded-2xl shadow-lg p-8 text-gris-piedra">
          <div className="flex items-center gap-3 mb-6">
            <img src="/vi-logo.svg" alt="Vi-ERP logo" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-semibold">Vi-ERP</h1>
              <p className="text-sm text-gris-piedra opacity-70">Inicia sesión para continuar</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-beige-arena">
                  {/* mail icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.94 6.34A2 2 0 014 6h12a2 2 0 011.06.34L10 11.5 2.94 6.34z" />
                    <path d="M18 8.24V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.24l8 5.26 8-5.26z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  className="block w-full pl-10 pr-3 py-2 rounded border border-beige-arena focus:outline-none focus:ring-2 focus:ring-oliva focus:border-oliva"
                  placeholder="tu@correo.com"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-terracota">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Contraseña</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-beige-arena">
                  {/* lock icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 8V6a5 5 0 1110 0v2h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2a3 3 0 116 0v2H7V6z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className="block w-full pl-10 pr-3 py-2 rounded border border-beige-arena focus:outline-none focus:ring-2 focus:ring-oliva focus:border-oliva"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-terracota">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm">
                <input type="checkbox" className="h-4 w-4 rounded border-beige-arena" />
                <span className="ml-2 text-gris-piedra opacity-80">Recordarme</span>
              </label>
              <Link to="#" className="text-sm text-terracota hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center items-center rounded-md bg-oliva text-marfil py-2 px-4 hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gris-piedra">
            ¿No tienes cuenta? <Link to="#" className="text-oliva font-medium hover:underline">Regístrate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
