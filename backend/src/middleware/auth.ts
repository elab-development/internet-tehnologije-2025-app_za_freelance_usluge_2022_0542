import { FastifyRequest, FastifyReply } from "fastify";

type Role = "FREELANCER" | "CLIENT" | "ADMIN";

export async function authRequired(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
}

export function requireRole(roles: Role[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as { role?: Role };
    if (!user?.role || !roles.includes(user.role)) {
      return reply.code(403).send({ message: "Forbidden" });
    }
  };
}
