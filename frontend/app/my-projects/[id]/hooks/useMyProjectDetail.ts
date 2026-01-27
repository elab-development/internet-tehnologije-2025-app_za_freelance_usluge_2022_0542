"use client";

import { useCallback, useState } from "react";

import { useIsClient } from "../../../hooks/useIsClient";
import { useRequireRole } from "../../../hooks/useRequireRole";
import { useAsync } from "../../../hooks/useAsync";

import {
  getProjectById,
  type Project,
} from "../../../services/projects.service";
import {
  acceptBid,
  getBidsForProject,
  type Bid,
} from "../../../services/bid.service";

export function useMyProjectDetail(projectId: string | undefined) {
  const isClient = useIsClient();
  const { allowed: canView } = useRequireRole("CLIENT");

  const fetcher = useCallback(async () => {
    if (!isClient || !canView || !projectId) {
      return {
        project: null as (Project & { clientId: string }) | null,
        bids: [] as Bid[],
      };
    }

    const p = await getProjectById(projectId);
    const b = await getBidsForProject(projectId);

    return {
      project: p.project as Project & { clientId: string },
      bids: b.bids,
    };
  }, [isClient, canView, projectId]);

  const { data, loading, error, run } = useAsync(
    fetcher,
    `${isClient}-${canView}-${projectId ?? "none"}`,
  );

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  async function refresh() {
    await run();
  }

  async function onAccept(bidId: string) {
    setActionErr(null);
    setAcceptingId(bidId);
    try {
      await acceptBid(bidId);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Accept failed";
      setActionErr(message);
    } finally {
      setAcceptingId(null);
    }
  }

  return {
    isClient,
    canView, // same prop your page expects
    project: data?.project ?? null,
    bids: data?.bids ?? [],
    loading,
    err: error,
    actionErr,
    acceptingId,
    onAccept,
    refresh,
  };
}
