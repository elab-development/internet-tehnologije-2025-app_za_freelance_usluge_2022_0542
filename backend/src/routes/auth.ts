import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { registerSchema, loginSchema } from "../utils/validation";
import { body } from "../utils/validate";
import { HttpError } from "../utils/http";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const input = body(req, registerSchema);

    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) throw new HttpError(409, "Email already exists");

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: await hashPassword(input.password),
        role: input.role,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (user.role === "FREELANCER") {
      await prisma.freelancerProfile.create({ data: { userId: user.id } });
    }

    return reply.code(201).send({ user });
  });

  app.post("/auth/login", async (req, reply) => {
    const input = body(req, loginSchema);

    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (!user) throw new HttpError(401, "Invalid credentials");

    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const token = app.jwt.sign({
      sub: user.id,
      role: user.role,
      email: user.email,
    });

    return reply.send({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  });

  app.get("/auth/me", async (req, reply) => {
    try {
      await req.jwtVerify();
      return reply.send({
        user: { id: req.user.sub, email: req.user.email, role: req.user.role },
      });
    } catch {
      throw new HttpError(401, "Unauthorized");
    }
  });

  app.post("/auth/logout", async (_req, reply) => {
    return reply.send({ ok: true });
  });
}
