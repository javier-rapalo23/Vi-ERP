import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import App from "./App";
import { Protected } from "@/shared/hooks/useAuthGuard";

const Login = lazy(() => import("@/modules/auth/pages/Login"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const POS = lazy(() => import("@/modules/pos/pages/POS"));
const ProductosList = lazy(() => import("@/modules/inventario/pages/ProductosList"));
const ProductoForm = lazy(() => import("@/modules/inventario/pages/ProductoForm"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      {
        path: "dashboard",
        element: (
          <Protected roles={["admin", "user", "cajero"]}>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "pos",
        element: (
          <Protected roles={["admin", "cajero"]}>
            <POS />
          </Protected>
        ),
      },
      {
        path: "inventario",
        children: [
          {
            index: true,
            element: (
              <Protected roles={["admin"]}>
                <ProductosList />
              </Protected>
            ),
          },
          {
            path: "nuevo",
            element: (
              <Protected roles={["admin"]}>
                <ProductoForm />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <Navigate to="/" /> },
]);
