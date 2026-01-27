"use client";

import { useCallback } from "react";

import { useIsClient } from "../../hooks/useIsClient";
import { useRequireRole } from "../../hooks/useRequireRole";
import { useAsync } from "../../hooks/useAsync";

import { getMyProjects, type Project } from "../../services/projects.service";

export function useMyProjects() {
  const isClient = useIsClient();
  const { allowed: canView } = useRequireRole("CLIENT");

  const fetcher = useCallback(async () => {
    if (!isClient || !canView) return [] as Project[];
    const data = await getMyProjects();
    return data.projects ?? [];
  }, [isClient, canView]);

  const { data, loading, error, run } = useAsync(
    fetcher,
    `${isClient}-${canView}-myprojects`,
  );

  return {
    isClient,
    canView,
    projects: data ?? [],
    loading,
    err: error,
    refresh: run,
  };
}
