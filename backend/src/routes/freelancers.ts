import { FastifyInstance } from "fastify";
import { prisma } from "../prisma";
import { authRequired, requireRole } from "../middleware/auth";
import { updateProfileSchema } from "../utils/validation";

export async function freelancerRoutes(app: FastifyInstance) {
  // List freelancers (public)
  app.get("/freelancers", async (req, reply) => {
    const { skills } = req.query as { skills?: string };
    const skillList = skills
      ? skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean)
      : [];

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
      select: {
        id: true,
        email: true,
        freelancerProfile: {
          select: {
            title: true,
            bio: true,
            githubUrl: true,
            skills: { include: { skill: true } },
          },
        },
      },
    });

    return reply.send({ freelancers });
  });

  // Get freelancer by id
  app.get("/freelancers/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const freelancer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        freelancerProfile: {
          select: {
            title: true,
            bio: true,
            githubUrl: true,
            skills: { include: { skill: true } },
          },
        },
      },
    });

    if (!freelancer || !freelancer.freelancerProfile)
      return reply.code(404).send({ message: "Freelancer not found" });
    return reply.send({ freelancer });
  });

  // Update my freelancer profile
  app.put(
    "/me/profile",
    { preHandler: [authRequired, requireRole(["FREELANCER"] as any)] },
    async (req, reply) => {
      const parsed = updateProfileSchema.safeParse(req.body);
      if (!parsed.success)
        return reply
          .code(400)
          .send({
            message: "Validation error",
            details: parsed.error.flatten(),
          });

      const user = req.user as any;

      const profile = await prisma.freelancerProfile.update({
        where: { userId: user.sub },
        data: parsed.data,
      });

      return reply.send({ profile });
    },
  );

  // Add skill to my profile (creates skill if not exists)
  app.post(
    "/me/skills",
    { preHandler: [authRequired, requireRole(["FREELANCER"] as any)] },
    async (req, reply) => {
      const user = req.user as any;
      const body = req.body as { name: string; level: number };

      if (!body?.name || !body?.level)
        return reply.code(400).send({ message: "name and level required" });

      const name = body.name.trim().toLowerCase();
      const level = Number(body.level);
      if (!name) return reply.code(400).send({ message: "Invalid skill name" });
      if (!Number.isInteger(level) || level < 1 || level > 5)
        return reply.code(400).send({ message: "level must be 1-5" });

      const profile = await prisma.freelancerProfile.findUnique({
        where: { userId: user.sub },
      });
      if (!profile)
        return reply.code(404).send({ message: "Profile not found" });

      const skill = await prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name },
      });

      try {
        const fs = await prisma.freelancerSkill.create({
          data: { profileId: profile.id, skillId: skill.id, level },
        });
        return reply.code(201).send({ freelancerSkill: fs });
      } catch {
        return reply.code(409).send({ message: "Skill already added" });
      }
    },
  );
}
