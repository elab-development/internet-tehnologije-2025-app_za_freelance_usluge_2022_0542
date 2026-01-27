"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../hooks/useAuth";
import { useIsClient } from "../../hooks/useIsClient";
import { getMyProjects, type Project } from "../../services/projects.service";

export function useMyProjects() {
  const router = useRouter();
  const { user, isAuthed } = useAuth();
  const isClient = useIsClient();

  const canView = useMemo(
    () => isAuthed && user?.role === "CLIENT",
    [isAuthed, user?.role],
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getMyProjects();
      setProjects(data.projects);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to load projects";
      setErr(message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthed) {
      router.push("/login");
      return;
    }

    if (user?.role !== "CLIENT") {
      router.push("/dashboard");
      return;
    }

    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, isAuthed, user?.role]);

  return { isClient, canView, projects, loading, err, refresh };
}
