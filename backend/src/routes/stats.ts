import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";

export async function statsRoutes(app: FastifyInstance) {
  // Platform statistics — used for dashboard charts
  app.get(
    "/stats",
    {
      schema: {
        tags: ["stats"],
        summary: "Statistike platforme (projekti, bidovi, korisnici)",
        response: {
          200: {
            type: "object",
            properties: {
              projects: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  byStatus: {
                    type: "object",
                    properties: {
                      OPEN: { type: "number" },
                      IN_PROGRESS: { type: "number" },
                      DONE: { type: "number" },
                      CANCELLED: { type: "number" },
                    },
                  },
                },
              },
              bids: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  byStatus: {
                    type: "object",
                    properties: {
                      PENDING: { type: "number" },
                      ACCEPTED: { type: "number" },
                      REJECTED: { type: "number" },
                    },
                  },
                },
              },
              users: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  byRole: {
                    type: "object",
                    properties: {
                      CLIENT: { type: "number" },
                      FREELANCER: { type: "number" },
                      ADMIN: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (_req, reply) => {
      const [
        projectsByStatus,
        bidsByStatus,
        usersByRole,
      ] = await Promise.all([
        prisma.project.groupBy({ by: ["status"], _count: { id: true } }),
        prisma.bid.groupBy({ by: ["status"], _count: { id: true } }),
        prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
      ]);

      const projectCounts = Object.fromEntries(
        projectsByStatus.map((r) => [r.status, r._count.id])
      ) as Record<string, number>;

      const bidCounts = Object.fromEntries(
        bidsByStatus.map((r) => [r.status, r._count.id])
      ) as Record<string, number>;

      const userCounts = Object.fromEntries(
        usersByRole.map((r) => [r.role, r._count.id])
      ) as Record<string, number>;

      return reply.send({
        projects: {
          total: projectsByStatus.reduce((s, r) => s + r._count.id, 0),
          byStatus: {
            OPEN: projectCounts["OPEN"] ?? 0,
            IN_PROGRESS: projectCounts["IN_PROGRESS"] ?? 0,
            DONE: projectCounts["DONE"] ?? 0,
            CANCELLED: projectCounts["CANCELLED"] ?? 0,
          },
        },
        bids: {
          total: bidsByStatus.reduce((s, r) => s + r._count.id, 0),
          byStatus: {
            PENDING: bidCounts["PENDING"] ?? 0,
            ACCEPTED: bidCounts["ACCEPTED"] ?? 0,
            REJECTED: bidCounts["REJECTED"] ?? 0,
          },
        },
        users: {
          total: usersByRole.reduce((s, r) => s + r._count.id, 0),
          byRole: {
            CLIENT: userCounts["CLIENT"] ?? 0,
            FREELANCER: userCounts["FREELANCER"] ?? 0,
            ADMIN: userCounts["ADMIN"] ?? 0,
          },
        },
      });
    }
  );
}
