import { apiFetch } from "./api";

export type CreateProjectInput = {
  title: string;
  description: string;
  budgetMin?: number;
  budgetMax?: number;
};

export async function createProject(input: CreateProjectInput) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type Project = {
  id: string;
  title: string;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  createdAt: string;
};

export async function getMyProjects() {
  const data = await apiFetch("/me/projects", { method: "GET" });
  return data as { projects: Project[] };
}

export async function getOpenProjects() {
  const data = await apiFetch("/projects", { method: "GET" });
  return data as { projects: Project[] };
}

export async function getProjectById(id: string) {
  const data = await apiFetch(`/projects/${id}`, { method: "GET" });
  return data as { project: Project & { clientId: string } };
}
