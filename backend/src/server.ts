import Fastify from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { bidRoutes } from "./routes/bids";
import { freelancerRoutes } from "./routes/freelancers";
import jwt from "@fastify/jwt";

const app = Fastify({ logger: true });

async function main() {
  await app.register(cors, { origin: true });
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "change_me",
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
