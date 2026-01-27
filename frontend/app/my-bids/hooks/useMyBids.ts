"use client";

import { useCallback } from "react";
import { getMyBids, type Bid } from "../../services/bid.service";
import { useAsync } from "../../hooks/useAsync";
import { useRequireRole } from "../../hooks/useRequireRole";

export function useMyBids() {
  const { isClient, allowed: canView } = useRequireRole("FREELANCER");

  const fetcher = useCallback(async () => {
    if (!isClient || !canView) return [] as Bid[];
    const data = await getMyBids();
    return data.bids ?? [];
  }, [isClient, canView]);

  const { data, loading, error, run } = useAsync(
    fetcher,
    `${isClient}-${canView}-mybids`,
  );

  return {
    isClient,
    canView,
    bids: data ?? [],
    loading,
    err: error,
    refresh: run,
  };
}
