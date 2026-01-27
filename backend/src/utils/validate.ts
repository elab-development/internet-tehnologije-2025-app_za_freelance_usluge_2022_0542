import { ZodSchema } from "zod";
import { HttpError } from "./http";
import { FastifyRequest } from "fastify";

export function body<T>(req: FastifyRequest, schema: ZodSchema<T>): T {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, "Validation error", parsed.error.flatten());
  }
  return parsed.data;
}

export function params<T>(req: FastifyRequest, schema: ZodSchema<T>): T {
  const parsed = schema.safeParse(req.params);
  if (!parsed.success) {
    throw new HttpError(400, "Validation error", parsed.error.flatten());
  }
  return parsed.data;
}

export function query<T>(req: FastifyRequest, schema: ZodSchema<T>): T {
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) {
    throw new HttpError(400, "Validation error", parsed.error.flatten());
  }
  return parsed.data;
}
