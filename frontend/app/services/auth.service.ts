import { apiFetch } from "./api";

/**
 * Autentifikacione rute – ispunjava backend zahtev:
 * login / register
 */

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
