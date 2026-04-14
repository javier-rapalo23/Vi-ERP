import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/shared/store/auth.store";

type RetryRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function requestTokenRefresh(): Promise<string | null> {
  try {
    const { data } = await api.post(
      "/auth/refresh",
      {},
      { skipAuthRefresh: true } as RetryRequestConfig
    );

    const newToken = data?.token as string | undefined;
    if (!newToken) return null;

    useAuthStore.getState().setToken(newToken);
    return newToken;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const originalRequest = (error.config || {}) as RetryRequestConfig;
    const status = error.response?.status;
    const code = (error.response?.data as any)?.code;

    if (
      status === 401 &&
      code === "TOKEN_EXPIRED" &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = requestTokenRefresh().finally(() => {
          isRefreshing = false;
        });
      }

      const refreshedToken = await refreshPromise;
      if (refreshedToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        return api(originalRequest);
      }
    }

    if (status === 401 || status === 403) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
