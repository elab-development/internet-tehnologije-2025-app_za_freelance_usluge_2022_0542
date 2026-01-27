"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  void onStoreChange; // satisfy eslint, no-op
  return () => {};
}

function getSnapshot() {
  return true; // on client
}

function getServerSnapshot() {
  return false; // on server
}

export function useIsClient() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
