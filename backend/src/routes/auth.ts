import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { hashPassword, verifyPassword } from "../utils/password";
import { registerSchema, loginSchema } from "../utils/validation";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success)
      return reply
        .code(400)
        .send({ message: "Validation error", details: parsed.error.flatten() });

    const { email, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return reply.code(409).send({ message: "Email already exists" });

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        role: role,
      },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    // Auto-create freelancer profile if freelancer
    if (user.role === "FREELANCER") {
      await prisma.freelancerProfile.create({ data: { userId: user.id } });
    }

    return reply.code(201).send({ user });
  });

  app.post("/auth/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
      return reply
        .code(400)
        .send({ message: "Validation error", details: parsed.error.flatten() });

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ message: "Invalid credentials" });

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
      return reply.send({ user: req.user });
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });
}
