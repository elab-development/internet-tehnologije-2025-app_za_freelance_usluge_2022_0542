import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { auth } from "../middleware/guards";
import { createProjectSchema } from "../utils/validation";
import { body, params as vParams } from "../utils/validate";
import { projectPublicSelect } from "../dto/selectors";
import { z } from "zod";
import { HttpError } from "../utils/http";

const idParams = z.object({ id: z.string().min(1) });

export async function projectRoutes(app: FastifyInstance) {
  // Public list of OPEN projects
  app.get("/projects", async (_req, reply) => {
    const projects = await prisma.project.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
      select: projectPublicSelect,
    });
    return reply.send({ projects });
  });

  // Public project details
  app.get("/projects/:id", async (req, reply) => {
    const { id } = vParams(req, idParams);

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        ...projectPublicSelect,
        clientId: true,
      },
    });

    if (!project) throw new HttpError(404, "Project not found");
    return reply.send({ project });
  });

  // Create project (CLIENT only)
  app.post(
    "/projects",
    { preHandler: auth(["CLIENT"]) },
    async (req, reply) => {
      const input = body(req, createProjectSchema);

      const project = await prisma.project.create({
        data: {
          clientId: req.user.sub,
          ...input,
        },
        select: {
          ...projectPublicSelect,
          clientId: true,
        },
      });

      return reply.code(201).send({ project });
    },
  );

  // My projects (CLIENT)
  app.get(
    "/me/projects",
    { preHandler: auth(["CLIENT"]) },
    async (req, reply) => {
      const projects = await prisma.project.findMany({
        where: { clientId: req.user.sub },
        orderBy: { createdAt: "desc" },
        select: projectPublicSelect,
      });

      return reply.send({ projects });
    },
  );
}
