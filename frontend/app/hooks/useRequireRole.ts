"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type Role } from "./useAuth";
import { useIsClient } from "./useIsClient";

type Options = {
  redirectToLogin?: string; // default: "/login"
  redirectToDashboard?: string; // default: "/dashboard"
};

export function useRequireRole(required: Role | Role[], opts: Options = {}) {
  const router = useRouter();
  const { user, isAuthed } = useAuth();
  const isClient = useIsClient();

  const roles = useMemo(
    () => (Array.isArray(required) ? required : [required]),
    [required],
  );

  // NO useMemo here — keeps React Compiler happy and avoids “preserve memoization” warnings.
  const allowed =
    isClient && isAuthed && !!user?.role && roles.includes(user.role);

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthed) {
      router.push(opts.redirectToLogin ?? "/login");
      return;
    }

    if (!user?.role || !roles.includes(user.role)) {
      router.push(opts.redirectToDashboard ?? "/dashboard");
    }
  }, [
    isClient,
    isAuthed,
    user, // include full user to satisfy compiler inference
    roles,
    router,
    opts.redirectToLogin,
    opts.redirectToDashboard,
  ]);

  return { isClient, allowed, user };
}
