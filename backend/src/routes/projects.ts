import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { authRequired, requireRole } from "../middleware/auth";
import { createProjectSchema } from "../utils/validation";

export async function projectRoutes(app: FastifyInstance) {
  // Public list of OPEN projects
  app.get("/projects", async (_req, reply) => {
    const projects = await prisma.project.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        budgetMin: true,
        budgetMax: true,
        status: true,
        createdAt: true,
      },
    });
    return reply.send({ projects });
  });

  // Public project details (NO bids here)
  app.get("/projects/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        budgetMin: true,
        budgetMax: true,
        status: true,
        createdAt: true,
        clientId: true,
      },
    });
    if (!project) return reply.code(404).send({ message: "Project not found" });
    return reply.send({ project });
  });

  // Create project (CLIENT only)
  app.post(
    "/projects",
    { preHandler: [authRequired, requireRole(["CLIENT"])] },
    async (req, reply) => {
      const parsed = createProjectSchema.safeParse(req.body);
      if (!parsed.success)
        return reply.code(400).send({
          message: "Validation error",
          details: parsed.error.flatten(),
        });

      const user = req.user as { sub: string };
      const project = await prisma.project.create({
        data: {
          clientId: user.sub,
          ...parsed.data,
        },
      });

      return reply.code(201).send({ project });
    },
  );

  // My projects (CLIENT)
  app.get(
    "/me/projects",
    { preHandler: [authRequired, requireRole(["CLIENT"])] },
    async (req, reply) => {
      const user = req.user as { sub: string };
      const projects = await prisma.project.findMany({
        where: { clientId: user.sub },
        orderBy: { createdAt: "desc" },
      });
      return reply.send({ projects });
    },
  );
}
