import api from "@/shared/api/axios";

export async function loginApi(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { token, role, user }
}
