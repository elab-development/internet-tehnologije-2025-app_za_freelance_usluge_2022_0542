"use client";

import { useCallback } from "react";
import { getOpenProjects, type Project } from "../../services/projects.service";
import { useIsClient } from "../../hooks/useIsClient";
import { useAsync } from "../../hooks/useAsync";

export function useOpenProjects() {
  const isClient = useIsClient();

  const fn = useCallback(async () => {
    if (!isClient) return [] as Project[];
    const data = await getOpenProjects();
    return (data as { projects: Project[] }).projects ?? [];
  }, [isClient]);

  const { data, loading, error, run } = useAsync<Project[]>(
    fn,
    isClient ? "client" : "ssr",
  );

  return {
    isClient,
    projects: data ?? [],
    loading,
    err: error,
    refresh: run,
  };
}
