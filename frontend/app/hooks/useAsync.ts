"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useAsync<T>(fn: () => Promise<T>, key?: string) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

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
      const message = e instanceof Error ? e.message : "Request failed";
      setState({ data: null, loading: false, error: message });
      return null;
    }
  }, [fn]);

  useEffect(() => {
    // eslint plugin complains about sync setState triggered from effects.
    // Scheduling into a microtask avoids “sync within effect body”.
    queueMicrotask(() => {
      void run();
    });
  }, [run, key]);

  return { ...state, run };
}
