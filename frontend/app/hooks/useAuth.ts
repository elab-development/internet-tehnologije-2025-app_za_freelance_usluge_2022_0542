"use client";

import { useState } from "react";

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

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => readAuthFromStorage());

  function setSession(token: string, user: StoredUser) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  }

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
