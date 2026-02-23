import { apiFetch } from "./api";

export type FreelancerSkill = {
  id: string;
  level: number;
  skill: { id: string; name: string };
};

export type FreelancerProfile = {
  title: string | null;
  bio: string | null;
  githubUrl: string | null;
  skills: FreelancerSkill[];
};

export type Freelancer = {
  id: string;
  email: string;
  freelancerProfile: FreelancerProfile | null;
};

export type UpdateProfileInput = {
  title?: string;
  bio?: string;
  githubUrl?: string;
};

export async function getFreelancers(skills?: string) {
  const query = skills ? `?skills=${encodeURIComponent(skills)}` : "";
  const data = await apiFetch(`/freelancers${query}`, { method: "GET" });
  return data as { freelancers: Freelancer[] };
}

export async function updateMyProfile(input: UpdateProfileInput) {
  const data = await apiFetch("/me/profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
  return data as { profile: { id: string; title: string | null; bio: string | null; githubUrl: string | null } };
}
