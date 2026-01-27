import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { authRequired, requireRole } from "../middleware/auth";
import { createBidSchema } from "../utils/validation";

// Prisma error helper (no hard dependency on Prisma enum)
function isUniqueConstraintError(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as any).code === "P2002"
  );
}

export async function bidRoutes(app: FastifyInstance) {
  // Freelancer creates bid on project
  app.post(
    "/projects/:id/bids",
    { preHandler: [authRequired, requireRole(["FREELANCER"] as any)] },
    async (req, reply) => {
      const { id: projectId } = req.params as { id: string };
      const parsed = createBidSchema.safeParse(req.body);

      if (!parsed.success) {
        return reply.code(400).send({
          message: "Validation error",
          details: parsed.error.flatten(),
        });
      }

      const user = req.user as any;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, status: true },
      });

      if (!project)
        return reply.code(404).send({ message: "Project not found" });
      if (project.status !== "OPEN")
        return reply.code(400).send({ message: "Project is not open" });

      try {
        const bid = await prisma.bid.create({
          data: {
            projectId,
            freelancerId: user.sub,
            ...parsed.data,
          },
        });

        return reply.code(201).send({ bid });
      } catch (err) {
        if (isUniqueConstraintError(err)) {
          return reply
            .code(409)
            .send({ message: "You already bid on this project" });
        }
        req.log.error(err);
        return reply.code(500).send({ message: "Failed to create bid" });
      }
    },
  );

  // Client views bids for a project (must own project)
  app.get(
    "/projects/:id/bids",
    { preHandler: [authRequired, requireRole(["CLIENT"] as any)] },
    async (req, reply) => {
      const { id: projectId } = req.params as { id: string };
      const user = req.user as any;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, clientId: true },
      });

      if (!project)
        return reply.code(404).send({ message: "Project not found" });
      if (project.clientId !== user.sub)
        return reply.code(403).send({ message: "Forbidden" });

      const bids = await prisma.bid.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        include: {
          freelancer: { select: { id: true, email: true, role: true } },
        },
      });

      return reply.send({ bids });
    },
  );

  // Client accepts a bid (must own project) - race-safe
  app.post(
    "/bids/:id/accept",
    { preHandler: [authRequired, requireRole(["CLIENT"] as any)] },
    async (req, reply) => {
      const { id: bidId } = req.params as { id: string };
      const user = req.user as any;

      try {
        const ok = await prisma.$transaction(async (tx) => {
          const bid = await tx.bid.findUnique({
            where: { id: bidId },
            include: { project: true },
          });

          if (!bid) return { status: 404 as const, message: "Bid not found" };
          if (bid.project.clientId !== user.sub)
            return { status: 403 as const, message: "Forbidden" };
          if (bid.project.status !== "OPEN")
            return { status: 400 as const, message: "Project is not open" };
          if (bid.status !== "PENDING")
            return { status: 409 as const, message: "Bid is not pending" };

          // Guard update: accept only if still pending
          const accepted = await tx.bid.updateMany({
            where: { id: bidId, status: "PENDING" },
            data: { status: "ACCEPTED" },
          });

          if (accepted.count !== 1)
            return { status: 409 as const, message: "Bid already processed" };

          await tx.bid.updateMany({
            where: {
              projectId: bid.projectId,
              id: { not: bidId },
              status: "PENDING",
            },
            data: { status: "REJECTED" },
          });

          await tx.project.update({
            where: { id: bid.projectId },
            data: { status: "IN_PROGRESS" },
          });

          return { status: 200 as const, message: "OK" };
        });

        if (ok.status !== 200)
          return reply.code(ok.status).send({ message: ok.message });
        return reply.send({ ok: true });
      } catch (err) {
        req.log.error(err);
        return reply.code(500).send({ message: "Failed to accept bid" });
      }
    },
  );

  // Freelancer views own bids
  app.get(
    "/me/bids",
    { preHandler: [authRequired, requireRole(["FREELANCER"] as any)] },
    async (req, reply) => {
      const user = req.user as any;

      const bids = await prisma.bid.findMany({
        where: { freelancerId: user.sub },
        orderBy: { createdAt: "desc" },
        include: { project: true },
      });

      return reply.send({ bids });
    },
  );
}
