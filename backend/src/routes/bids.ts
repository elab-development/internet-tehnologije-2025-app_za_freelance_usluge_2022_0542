import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { auth } from "../middleware/guards";
import { createBidSchema } from "../utils/validation";
import { body, params as vParams } from "../utils/validate";
import { userPublicSelect } from "../dto/selectors";
import { HttpError } from "../utils/http";
import { z } from "zod";
import { isPrismaUniqueError } from "../utils/prismaErrors";
import { acceptBidService } from "../services/bids.service";

const projectIdParams = z.object({ id: z.string().min(1) });
const bidIdParams = z.object({ id: z.string().min(1) });

export async function bidRoutes(app: FastifyInstance) {
  // Freelancer creates bid on project
  app.post(
    "/projects/:id/bids",
    { preHandler: auth(["FREELANCER"]) },
    async (req, reply) => {
      const { id: projectId } = vParams(req, projectIdParams);
      const input = body(req, createBidSchema);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, status: true },
      });

      if (!project) throw new HttpError(404, "Project not found");
      if (project.status !== "OPEN")
        throw new HttpError(400, "Project is not open");

      try {
        const bid = await prisma.bid.create({
          data: {
            projectId,
            freelancerId: req.user.sub,
            ...input,
          },
        });

        return reply.code(201).send({ bid });
      } catch (err) {
        if (isPrismaUniqueError(err)) {
          throw new HttpError(409, "You already bid on this project");
        }
        req.log.error(err);
        throw new HttpError(500, "Failed to create bid");
      }
    },
  );

  // Client views bids for a project (must own project)
  app.get(
    "/projects/:id/bids",
    { preHandler: auth(["CLIENT"]) },
    async (req, reply) => {
      const { id: projectId } = vParams(req, projectIdParams);

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, clientId: true },
      });

      if (!project) throw new HttpError(404, "Project not found");
      if (project.clientId !== req.user.sub)
        throw new HttpError(403, "Forbidden");

      const bids = await prisma.bid.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        include: {
          freelancer: { select: userPublicSelect },
        },
      });

      return reply.send({ bids });
    },
  );

  // Client accepts a bid (must own project) - race-safe
  app.post(
    "/bids/:id/accept",
    { preHandler: auth(["CLIENT"]) },
    async (req, reply) => {
      const { id: bidId } = vParams(req, bidIdParams);

      const result = await acceptBidService({
        bidId,
        clientId: req.user.sub,
      });

      return reply.send(result);
    },
  );

  // Freelancer views own bids
  app.get(
    "/me/bids",
    { preHandler: auth(["FREELANCER"]) },
    async (req, reply) => {
      const bids = await prisma.bid.findMany({
        where: { freelancerId: req.user.sub },
        orderBy: { createdAt: "desc" },
        include: { project: true },
      });

      return reply.send({ bids });
    },
  );
}
