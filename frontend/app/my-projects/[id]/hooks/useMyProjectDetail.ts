"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../../../hooks/useAuth";
import { useIsClient } from "../../../hooks/useIsClient";
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
  const router = useRouter();
  const { user, isAuthed } = useAuth();
  const isClient = useIsClient();

  const canView = useMemo(
    () => isAuthed && user?.role === "CLIENT",
    [isAuthed, user?.role],
  );

  const [project, setProject] = useState<
    (Project & { clientId: string }) | null
  >(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  async function refresh() {
    if (!projectId) return;

    setLoading(true);
    setErr(null);
    try {
      const p = await getProjectById(projectId);
      setProject(p.project);

      const b = await getBidsForProject(projectId);
      setBids(b.bids);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load project";
      setErr(message);
      setProject(null);
      setBids([]);
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
  }, [isClient, isAuthed, user?.role, projectId]);

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
    canView,
    project,
    bids,
    loading,
    err,
    actionErr,
    acceptingId,
    onAccept,
    refresh,
  };
}
