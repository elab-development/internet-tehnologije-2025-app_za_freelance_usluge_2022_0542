"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Zajedničko stanje za asinhrone operacije:
 * data – rezultat sa API-ja
 * loading – da li je zahtev u toku
 * error – poruka greške
 */
type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Custom hook koji ispunjava zahtev:
 * - korišćenje React hook-ova
 * - realna funkcionalnost (rad sa API-jem)
 *
 * Koristi se za učitavanje podataka i refresh nakon akcija.
 */
export function useAsync<T>(fn: () => Promise<T>, key?: string) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Sprečava da stari API odgovor pregazi noviji
  const runId = useRef(0);

  const run = useCallback(async () => {
    const id = ++runId.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const result = await fn();
      if (id !== runId.current) return null;
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (e: unknown) {
      if (id !== runId.current) return null;
      const message =
        e instanceof Error ? e.message : "Greška prilikom zahteva";
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, [fn]);

  // Automatsko učitavanje (npr. na promenu rute ili parametra)
  useEffect(() => {
    void run();
  }, [run, key]);

  return { ...state, run };
}
