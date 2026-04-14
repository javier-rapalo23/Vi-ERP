import express from "express";
import cors from "cors";
import ventaRoutes from "./presentation/routes/ventaRoutes";
import productoRoutes from "./presentation/routes/productoRoutes";
import authRoutes from "./presentation/routes/authRoutes";
import userRoutes from "./presentation/routes/userRoutes";
import roleRoutes from "./presentation/routes/roleRoutes";
import permissionRoutes from "./presentation/routes/permissionRoutes";
import supplierRoutes from "./presentation/routes/supplierRoutes";
import purchaseRoutes from "./presentation/routes/purchaseRoutes";
import aiRoutes from "./presentation/routes/aiRoutes";
import configurationRoutes from "./presentation/routes/configurationRoutes";
import customerRoutes from "./presentation/routes/customerRoutes";
import shiftRoutes from "./presentation/routes/shiftRoutes";
import dashboardRoutes from "./presentation/routes/dashboardRoutes";
import { swaggerSpec, swaggerUi } from "./presentation/routes/swagger";
import { config } from "./config/env";
import logger from "./config/logger";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir requests sin origin (como desde Postman, mismo origen, etc)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      config.frontendUrl, // URL del frontend desde .env
      "http://localhost:5173", // Desarrollo local
      "http://localhost:3000",
      "http://localhost:4173", // Preview de Vite
      "https://vixo-cloud.vercel.app", // Frontend en Vercel
    ];
    
    if (allowedOrigins.includes(origin) || config.nodeEnv === "development") {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 horas
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" })); // Aumentar límite para imágenes base64

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/configuration", configurationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/cajas", shiftRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Error no capturado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Vi-ERP API corriendo en puerto ${PORT}`);
  logger.info(`📚 Documentación disponible en http://localhost:${PORT}/docs`);
  console.log(`🚀 Vi-ERP API running on port ${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/docs`);
});