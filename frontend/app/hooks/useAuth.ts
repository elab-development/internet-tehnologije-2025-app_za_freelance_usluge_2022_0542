"use client";

import { useState } from "react";

/**
 * Tipovi korisnika – ispunjava backend zahtev
 * (najmanje 3 tipa korisnika)
 */
export type Role = "FREELANCER" | "CLIENT" | "ADMIN";

export type StoredUser = {
  id: string;
  email: string;
  role: Role;
};

export type AuthState = {
  token: string | null;
  user: StoredUser | null;
};

// Učitavanje sesije iz localStorage (posle refresh-a)
function readAuthFromStorage(): AuthState {
  if (typeof window === "undefined") return { token: null, user: null };

  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");

  let user: StoredUser | null = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as StoredUser;
    } catch {
      user = null;
    }
  }

  return { token, user };
}

/**
 * Custom hook za autentifikaciju (frontend deo).
 * Koristi se za:
 * - proveru da li je korisnik ulogovan
 * - role-based prikaz funkcionalnosti
 */
export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => readAuthFromStorage());

  // Poziva se nakon uspešnog login/register
  function setSession(token: string, user: StoredUser) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  }

  // Logout – brisanje sesije
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  }

  return {
    token: auth.token,
    user: auth.user,
    isAuthed: !!auth.token,
    setSession,
    logout,
  };
}
