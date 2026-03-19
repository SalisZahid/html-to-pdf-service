import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { env } from "../config/env.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Datarover API",
    version: "1.0.0",
    description: "REST API documentation for the Datarover backend.",
  },
  servers: [
    {
      url: "http://localhost:" + env.PORT + "/api/v1",
      description: "Local server",
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
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/v1/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

