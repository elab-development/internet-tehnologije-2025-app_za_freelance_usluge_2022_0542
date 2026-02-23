"use client";

import { useEffect, useState } from "react";

// Besplatan Exchange Rate API — ne zahteva API ključ
// https://open.er-api.com
const API_URL = "https://open.er-api.com/v6/latest/RSD";

type ExchangeRateState = {
  eurRate: number | null;
  loading: boolean;
  error: string | null;
};

let cache: { rate: number; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 sat

export function useExchangeRate(): ExchangeRateState {
  const [state, setState] = useState<ExchangeRateState>({
    eurRate: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      setState({ eurRate: cache.rate, loading: false, error: null });
      return;
    }

    let cancelled = false;

    fetch(API_URL)
      .then((r) => r.json())
      .then((data: { result: string; rates?: Record<string, number> }) => {
        if (cancelled) return;
        const rate = data?.rates?.["EUR"];
        if (typeof rate === "number") {
          cache = { rate, fetchedAt: Date.now() };
          setState({ eurRate: rate, loading: false, error: null });
        } else {
          setState({ eurRate: null, loading: false, error: "Rate unavailable" });
        }
      })
      .catch(() => {
        if (!cancelled)
          setState({ eurRate: null, loading: false, error: "Failed to fetch rate" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function rsdToEur(rsd: number, rate: number): string {
  return (rsd * rate).toFixed(0);
}
