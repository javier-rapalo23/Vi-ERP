import api from "@/shared/api/axios";

export async function loginApi(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { token, role, user }
}

export async function refreshTokenApi() {
  const { data } = await api.post("/auth/refresh", {});
  return data; // { token }
}

export async function checkSessionApi() {
  const { data } = await api.get("/auth/check");
  return data; // { valid, user }
}

export async function logoutApi() {
  const { data } = await api.post("/auth/logout", {});
  return data;
}
