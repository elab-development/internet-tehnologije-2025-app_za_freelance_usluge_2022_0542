import { FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";

export async function jwtPlugin(app: FastifyInstance) {
  app.register(jwt, {
    secret: process.env.JWT_SECRET || "change_me",
  });
}
