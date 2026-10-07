"use client";

import { useSyncExternalStore } from "react";

let runningVersion: string | null = null;
const listeners = new Set<() => void>();

export function setRunningVersion(version: string) {
  if (runningVersion === version) return;
  runningVersion = version;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useRunningVersion() {
  return useSyncExternalStore(
    subscribe,
    () => runningVersion,
    () => null,
  );
}

export function shortVersion(version: string) {
  return version.slice(0, 7);
}
