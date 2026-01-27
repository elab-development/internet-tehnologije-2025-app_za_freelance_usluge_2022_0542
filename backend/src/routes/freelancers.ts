import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { auth } from "../middleware/guards";
import { body as vBody, params as vParams } from "../utils/validate";
import { HttpError } from "../utils/http";
import { userPublicSelect } from "../dto/selectors";
import { updateProfileSchema } from "../utils/validation";
import { z } from "zod";
import { splitCsv } from "../utils/normalize";
import { addSkillToMyProfileService } from "../services/freelancers.service";
import { query as vQuery } from "../utils/validate";

const freelancerIdParams = z.object({ id: z.string().min(1) });

const freelancersQuerySchema = z.object({
  skills: z.string().optional(),
});

const addSkillSchema = z.object({
  name: z.string().trim().min(1),
  level: z.number().int().min(1).max(5),
});

const freelancerWithProfileSelect = {
  ...userPublicSelect,
  freelancerProfile: {
    select: {
      title: true,
      bio: true,
      githubUrl: true,
      skills: {
        select: {
          id: true,
          level: true,
          skill: { select: { id: true, name: true } },
        },
      },
    },
  },
} as const;

export async function freelancerRoutes(app: FastifyInstance) {
  // List freelancers (public)
  // Optional: ?skills=react,node,postgres
  app.get("/freelancers", async (req, reply) => {
    const q = vQuery(req, freelancersQuerySchema);
    const skillList = splitCsv(q.skills);

    const freelancers = await prisma.user.findMany({
      where: {
        role: "FREELANCER",
        ...(skillList.length
          ? {
              freelancerProfile: {
                skills: {
                  some: {
                    skill: { name: { in: skillList } },
                  },
                },
              },
            }
          : {}),
      },
      select: freelancerWithProfileSelect,
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ freelancers });
  });

  // Get freelancer by id (public)
  app.get("/freelancers/:id", async (req, reply) => {
    const { id } = vParams(req, freelancerIdParams);

    const freelancer = await prisma.user.findUnique({
      where: { id },
      select: freelancerWithProfileSelect,
    });

    if (!freelancer || !freelancer.freelancerProfile) {
      throw new HttpError(404, "Freelancer not found");
    }

    return reply.send({ freelancer });
  });

  // Update my freelancer profile
  app.put(
    "/me/profile",
    { preHandler: auth(["FREELANCER"]) },
    async (req, reply) => {
      const input = vBody(req, updateProfileSchema);

      const profile = await prisma.freelancerProfile.update({
        where: { userId: req.user.sub },
        data: input,
        select: {
          id: true,
          userId: true,
          title: true,
          bio: true,
          githubUrl: true,
          createdAt: true,
        },
      });

      return reply.send({ profile });
    },
  );

  // Add skill to my profile
  app.post(
    "/me/skills",
    { preHandler: auth(["FREELANCER"]) },
    async (req, reply) => {
      const input = vBody(req, addSkillSchema);

      const freelancerSkill = await addSkillToMyProfileService({
        userId: req.user.sub,
        name: input.name,
        level: input.level,
      });

      return reply.code(201).send({ freelancerSkill });
    },
  );
}
