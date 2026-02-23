import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { bidRoutes } from "./routes/bids";
import { freelancerRoutes } from "./routes/freelancers";
import { statsRoutes } from "./routes/stats";
import { HttpError } from "./utils/http";

const app = Fastify({ logger: true });

async function main() {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production");
  }

  // Security headers
  await app.register(helmet, {
    contentSecurityPolicy: false, // disabled so Swagger UI works
  });

  // CORS
  await app.register(cors, {
    origin: isProd
      ? (process.env.CORS_ORIGIN ?? "http://localhost:3000")
      : true,
  });

  // Rate limiting (100 req/min per IP)
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // JWT
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "dev_secret",
  });

  // Swagger (OpenAPI spec)
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Freelance App API",
        description:
          "REST API za freelance platformu — autentifikacija, projekti, bidovi i freelanceri.",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT ?? 4000}`,
          description: "Development server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT token dobijen pri login-u",
          },
        },
      },
      tags: [
        { name: "auth", description: "Autentifikacija i registracija" },
        { name: "projects", description: "Upravljanje projektima" },
        { name: "bids", description: "Bidovanje na projektima" },
        { name: "freelancers", description: "Freelancer profili" },
        { name: "stats", description: "Statistike platforme" },
      ],
    },
  });

  // Swagger UI na /docs
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });

  // Error handler
  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof HttpError) {
      const payload: Record<string, unknown> = { message: err.message };
      if (err.details !== undefined) payload.details = err.details;
      return reply.code(err.statusCode).send(payload);
    }

    if ((err as { name?: string })?.name === "ZodError") {
      return reply.code(400).send({ message: "Validation error" });
    }

    app.log.error(err);
    return reply.code(500).send({ message: "Internal server error" });
  });

  app.get(
    "/health",
    {
      schema: {
        tags: ["stats"],
        summary: "Health check",
        response: { 200: { type: "object", properties: { ok: { type: "boolean" } } } },
      },
    },
    async () => ({ ok: true })
  );

  await app.register(authRoutes);
  await app.register(projectRoutes);
  await app.register(bidRoutes);
  await app.register(freelancerRoutes);
  await app.register(statsRoutes);

  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: "0.0.0.0" });
}

main().catch((e) => {
  app.log.error(e);
  process.exit(1);
});
