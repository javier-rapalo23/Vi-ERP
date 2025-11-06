import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { 
      title: "Vi-ERP API", 
      version: "1.0.0",
      description: "API para el sistema ERP modular Vi-ERP con Clean Architecture",
      contact: {
        name: "Vi-ERP Team",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Ventas",
        description: "Gestión de ventas",
      },
    ],
  },
  apis: ["./src/presentation/controllers/*.ts", "./src/presentation/routes/*.ts"],
};

const swaggerSpec = swaggerJsDoc(options);
export { swaggerSpec, swaggerUi };