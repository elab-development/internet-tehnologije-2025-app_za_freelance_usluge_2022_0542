"use client";

import { useCallback } from "react";
import { useIsClient } from "../../../hooks/useIsClient";
import {
  getProjectById,
  type Project,
} from "../../../services/projects.service";
import { useAsync } from "../../../hooks/useAsync";

export function useProjectDetail(projectId: string | undefined) {
  const isClient = useIsClient();

  const fn = useCallback(async () => {
    if (!isClient || !projectId) return null;
    const data = await getProjectById(projectId);
    return data.project as Project & { clientId: string };
  }, [isClient, projectId]);

  const { data, loading, error, run } = useAsync(
    fn,
    `${isClient}-${projectId ?? "none"}`,
  );

  async function refresh() {
    await run();
  }

  return {
    isClient,
    project: data,
    loading,
    err: error,
    refresh,
  };
}
