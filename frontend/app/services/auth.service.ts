import { apiFetch } from "./api";

export async function register(
  email: string,
  password: string,
  role: "FREELANCER" | "CLIENT",
) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
