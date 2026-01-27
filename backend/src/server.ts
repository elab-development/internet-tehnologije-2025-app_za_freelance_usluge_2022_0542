import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { bidRoutes } from "./routes/bids";
import { freelancerRoutes } from "./routes/freelancers";
import { HttpError } from "./utils/http";

const app = Fastify({ logger: true });

async function main() {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in production");
  }

  await app.register(cors, { origin: true });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "dev_secret",
  });

  app.setErrorHandler((err, _req, reply) => {
    // Our typed HTTP errors
    if (err instanceof HttpError) {
      const payload: any = { message: err.message };
      if (err.details !== undefined) payload.details = err.details;
      return reply.code(err.statusCode).send(payload);
    }

    // Zod errors (safety net)
    if ((err as any)?.name === "ZodError") {
      return reply.code(400).send({ message: "Validation error" });
    }

    // Default: don't leak internals
    app.log.error(err);
    return reply.code(500).send({ message: "Internal server error" });
  });

  app.get("/health", async () => ({ ok: true }));

  await app.register(authRoutes);
  await app.register(projectRoutes);
  await app.register(bidRoutes);
  await app.register(freelancerRoutes);

  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: "0.0.0.0" });
}

main().catch((e) => {
  app.log.error(e);
  process.exit(1);
});
