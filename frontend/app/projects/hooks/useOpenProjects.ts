"use client";

import { useEffect, useState } from "react";
import { getOpenProjects, type Project } from "../../services/projects.service";
import { useIsClient } from "../../hooks/useIsClient";

export function useOpenProjects() {
  const isClient = useIsClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getOpenProjects();
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
    void refresh();
  }, [isClient]);

  return { isClient, projects, loading, err, refresh };
}
