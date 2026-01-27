import "@fastify/jwt";

type Role = "FREELANCER" | "CLIENT" | "ADMIN";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string; // userId
      email: string;
      role: Role;
    };
    user: {
      sub: string;
      email: string;
      role: Role;
    };
  }
}
