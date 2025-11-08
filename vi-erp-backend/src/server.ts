import express from "express";
import cors from "cors";
import ventaRoutes from "./presentation/routes/ventaRoutes";
import productoRoutes from "./presentation/routes/productoRoutes";
import authRoutes from "./presentation/routes/authRoutes";
import { swaggerSpec, swaggerUi } from "./presentation/routes/swagger";
import { config } from "./config/env";
import logger from "./config/logger";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/productos", productoRoutes);

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