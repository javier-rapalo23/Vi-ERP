import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy } from "react";
import App from "./App";
import { Protected } from "@/shared/hooks/useAuthGuard";

const Login = lazy(() => import("@/modules/auth/pages/Login"));
const Dashboard = lazy(() => import("@/modules/dashboard/pages/Dashboard"));
const POS = lazy(() => import("@/modules/pos/pages/POS"));
const ProductosList = lazy(() => import("@/modules/inventario/pages/ProductosList"));
const ProductoForm = lazy(() => import("@/modules/inventario/pages/ProductoForm"));
const AlertasInventario = lazy(() => import("@/modules/inventario/pages/AlertasInventario"));
const KardexProducto = lazy(() => import("@/modules/inventario/pages/KardexProducto"));

// Mantenimientos
const MantenimientosIndex = lazy(() => import("@/modules/mantenimientos/pages/MantenimientosIndex"));
const UsersList = lazy(() => import("@/modules/mantenimientos/pages/UsersList"));
const UserForm = lazy(() => import("@/modules/mantenimientos/pages/UserForm"));
const RolesList = lazy(() => import("@/modules/mantenimientos/pages/RolesList"));
const RoleForm = lazy(() => import("@/modules/mantenimientos/pages/RoleForm"));
const PermissionsList = lazy(() => import("@/modules/mantenimientos/pages/PermissionsList"));
const PermissionForm = lazy(() => import("@/modules/mantenimientos/pages/PermissionForm"));
const ConfigurationPage = lazy(() => import("@/modules/mantenimientos/pages/ConfigurationPage"));

// Ventas
const VentasIndex = lazy(() => import("@/modules/ventas/pages/VentasIndex"));
const ClientesList = lazy(() => import("@/modules/ventas/pages/ClientesList"));
const ClienteForm = lazy(() => import("@/modules/ventas/pages/ClienteForm"));
const HistorialVentas = lazy(() => import("@/modules/ventas/pages/HistorialVentas"));

// Compras
const ComprasIndex = lazy(() => import("@/modules/compras/pages/ComprasIndex"));
const SuppliersList = lazy(() => import("@/modules/compras/pages/SuppliersList"));
const SupplierForm = lazy(() => import("@/modules/compras/pages/SupplierForm"));
const PurchasesList = lazy(() => import("@/modules/compras/pages/PurchasesList"));
const PurchaseForm = lazy(() => import("@/modules/compras/pages/PurchaseForm"));
const PurchaseDetail = lazy(() => import("@/modules/compras/pages/PurchaseDetail"));

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
            path: "alertas",
            element: (
              <Protected roles={["admin"]}>
                <AlertasInventario />
              </Protected>
            ),
          },
          {
            path: ":productId/kardex",
            element: (
              <Protected roles={["admin"]}>
                <KardexProducto />
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
          {
            path: ":id/editar",
            element: (
              <Protected roles={["admin"]}>
                <ProductoForm />
              </Protected>
            ),
          },
        ],
      },
      {
        path: "ventas",
        children: [
          {
            index: true,
            element: (
              <Protected roles={["admin", "cajero"]}>
                <VentasIndex />
              </Protected>
            ),
          },
          {
            path: "clientes",
            children: [
              {
                index: true,
                element: (
                  <Protected roles={["admin", "cajero"]}>
                    <ClientesList />
                  </Protected>
                ),
              },
              {
                path: "nuevo",
                element: (
                  <Protected roles={["admin", "cajero"]}>
                    <ClienteForm />
                  </Protected>
                ),
              },
              {
                path: ":id/editar",
                element: (
                  <Protected roles={["admin", "cajero"]}>
                    <ClienteForm />
                  </Protected>
                ),
              },
            ],
          },
          {
            path: "historial",
            element: (
              <Protected roles={["admin", "cajero"]}>
                <HistorialVentas />
              </Protected>
            ),
          },
        ],
      },
      {
        path: "mantenimientos",
        children: [
          {
            index: true,
            element: (
              <Protected roles={["admin"]}>
                <MantenimientosIndex />
              </Protected>
            ),
          },
          {
            path: "usuarios",
            children: [
              {
                index: true,
                element: (
                  <Protected roles={["admin"]}>
                    <UsersList />
                  </Protected>
                ),
              },
              {
                path: "nuevo",
                element: (
                  <Protected roles={["admin"]}>
                    <UserForm />
                  </Protected>
                ),
              },
              {
                path: ":id/editar",
                element: (
                  <Protected roles={["admin"]}>
                    <UserForm />
                  </Protected>
                ),
              },
            ],
          },
          {
            path: "roles",
            children: [
              {
                index: true,
                element: (
                  <Protected roles={["admin"]}>
                    <RolesList />
                  </Protected>
                ),
              },
              {
                path: "nuevo",
                element: (
                  <Protected roles={["admin"]}>
                    <RoleForm />
                  </Protected>
                ),
              },
              {
                path: ":id/editar",
                element: (
                  <Protected roles={["admin"]}>
                    <RoleForm />
                  </Protected>
                ),
              },
            ],
          },
          {
            path: "permisos",
            children: [
              {
                index: true,
                element: (
                  <Protected roles={["admin"]}>
                    <PermissionsList />
                  </Protected>
                ),
              },
              {
                path: "nuevo",
                element: (
                  <Protected roles={["admin"]}>
                    <PermissionForm />
                  </Protected>
                ),
              },
              {
                path: ":id/editar",
                element: (
                  <Protected roles={["admin"]}>
                    <PermissionForm />
                  </Protected>
                ),
              },
            ],
          },
          {
            path: "configuracion",
            element: (
              <Protected roles={["admin"]}>
                <ConfigurationPage />
              </Protected>
            ),
          },
        ],
      },
      {
        path: "compras",
        children: [
          {
            index: true,
            element: (
              <Protected roles={["admin"]}>
                <ComprasIndex />
              </Protected>
            ),
          },
          {
            path: "proveedores",
            children: [
              {
                index: true,
                element: (
                  <Protected roles={["admin"]}>
                    <SuppliersList />
                  </Protected>
                ),
              },
              {
                path: "nuevo",
                element: (
                  <Protected roles={["admin"]}>
                    <SupplierForm />
                  </Protected>
                ),
              },
              {
                path: ":id/editar",
                element: (
                  <Protected roles={["admin"]}>
                    <SupplierForm />
                  </Protected>
                ),
              },
            ],
          },
          {
            path: "lista",
            element: (
              <Protected roles={["admin"]}>
                <PurchasesList />
              </Protected>
            ),
          },
          {
            path: ":id",
            element: (
              <Protected roles={["admin"]}>
                <PurchaseDetail />
              </Protected>
            ),
          },
          {
            path: "nueva",
            element: (
              <Protected roles={["admin"]}>
                <PurchaseForm />
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
