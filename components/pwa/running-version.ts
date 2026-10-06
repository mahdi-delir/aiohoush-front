"use client";

import { useSyncExternalStore } from "react";

/*
 * نسخهٔ build که همین الان در مرورگر اجرا می‌شود (همان BUILD_ID سرور در
 * لحظهٔ باز شدن اپ). UpdatePrompt آن را تنظیم می‌کند و منو نمایشش می‌دهد
 * تا بشود با چشم دید به‌روزرسانی واقعاً انجام شده یا نه.
 */
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

/** شکل کوتاه برای نمایش */
export function shortVersion(version: string) {
  return version.slice(0, 7);
}
