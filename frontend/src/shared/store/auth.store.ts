import { create } from "zustand";

type Role = "admin" | "cajero" | "contador" | "user";

interface AuthState {
  token: string | null;
  role: Role | null;
  user?: { id: number; name: string; email: string } | null;
  login: (data: { token: string; role: Role; user?: any }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  role: (localStorage.getItem("role") as Role) || null,
  user: JSON.parse(localStorage.getItem("user") || "null"),
  
  login: ({ token, role, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    set({ token, role, user });
  },
  
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    set({ token: null, role: null, user: null });
  },
}));
