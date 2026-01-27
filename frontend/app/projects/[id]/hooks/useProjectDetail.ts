"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "../../../hooks/useIsClient";
import {
  getProjectById,
  type Project,
} from "../../../services/projects.service";

export function useProjectDetail(projectId: string | undefined) {
  const isClient = useIsClient();

  const [project, setProject] = useState<
    (Project & { clientId: string }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    if (!projectId) return;

    setLoading(true);
    setErr(null);
    try {
      const data = await getProjectById(projectId);
      setProject(data.project);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load project";
      setErr(message);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isClient) return;
    void refresh();
  }, [isClient, projectId]);

  return { isClient, project, loading, err, refresh };
}
