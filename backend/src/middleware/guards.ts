import { FastifyReply, FastifyRequest } from "fastify";

type Role = "FREELANCER" | "CLIENT" | "ADMIN";

export function auth(roles?: Role[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    if (roles?.length) {
      const role = req.user.role as Role;
      if (!roles.includes(role)) {
        return reply.code(403).send({ message: "Forbidden" });
      }
    }
  };
}
