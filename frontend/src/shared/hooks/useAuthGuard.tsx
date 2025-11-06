import { useAuthStore } from "@/shared/store/auth.store";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export function Protected({
  roles,
  children,
}: {
  roles?: Array<"admin" | "cajero" | "contador" | "user">;
  children: React.ReactNode;
}) {
  const { token, role } = useAuthStore();
  const loc = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
