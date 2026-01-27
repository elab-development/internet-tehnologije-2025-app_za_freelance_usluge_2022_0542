export const userPublicSelect = {
  id: true,
  email: true,
  role: true,
} as const;

export const projectPublicSelect = {
  id: true,
  title: true,
  description: true,
  budgetMin: true,
  budgetMax: true,
  status: true,
  createdAt: true,
} as const;

export const freelancerSkillSelect = {
  id: true,
  level: true,
  skill: { select: { id: true, name: true } },
} as const;

export const freelancerProfileSelect = {
  title: true,
  bio: true,
  githubUrl: true,
  skills: { select: freelancerSkillSelect },
} as const;
