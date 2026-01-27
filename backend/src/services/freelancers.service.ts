import { prisma } from "../prisma";
import { HttpError } from "../utils/http";
import { isPrismaUniqueError } from "../utils/prismaErrors";
import { norm } from "../utils/normalize";

export async function addSkillToMyProfileService(params: {
  userId: string;
  name: string;
  level: number;
}) {
  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId: params.userId },
    select: { id: true },
  });

  if (!profile) throw new HttpError(404, "Profile not found");

  const name = norm(params.name);

  const skill = await prisma.skill.upsert({
    where: { name },
    update: {},
    create: { name },
    select: { id: true, name: true },
  });

  try {
    const freelancerSkill = await prisma.freelancerSkill.create({
      data: { profileId: profile.id, skillId: skill.id, level: params.level },
      select: {
        id: true,
        level: true,
        profileId: true,
        skill: { select: { id: true, name: true } },
      },
    });

    return freelancerSkill;
  } catch (err) {
    if (isPrismaUniqueError(err)) {
      throw new HttpError(409, "Skill already added");
    }
    throw new HttpError(500, "Failed to add skill");
  }
}
