"use client";

import { useEffect, useState } from "react";

import { setRunningVersion } from "./running-version";

const RELOAD_PARAM = "_v";

const CHECK_INTERVAL_MS = 10 * 60 * 1000;

export default function UpdatePrompt() {
  const [available, setAvailable] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const url = new URL(window.location.href);
    if (url.searchParams.has(RELOAD_PARAM)) {
      url.searchParams.delete(RELOAD_PARAM);
      window.history.replaceState(window.history.state, "", url);
    }

    let stopped = false;
    let baseline: string | null = null;

    async function check() {
      if (stopped || document.visibilityState !== "visible") return;

      try {
        const response = await fetch("/api/app-version", { cache: "no-store" });
        if (!response.ok) return;

        const body = (await response.json()) as { version?: string | null };
        if (!body.version || stopped) return;

        if (baseline === null) {
          baseline = body.version;
          setRunningVersion(baseline);
        } else if (body.version !== baseline) {
          setAvailable(body.version);
        }
      } catch {}
    }

    const first = window.setTimeout(check, 0);
    const interval = window.setInterval(check, CHECK_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") void check();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      stopped = true;
      window.clearTimeout(first);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  if (!available || dismissed) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-primary-green/30 bg-card-bg/95 p-4 text-text-primary shadow-2xl backdrop-blur"
    >
      <p className="flex-1 text-sm leading-7">
        نسخهٔ جدید آیوهوش آماده است.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="rounded-xl px-3 py-2 text-xs text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-primary-green"
      >
        بعداً
      </button>
      <button
        type="button"
        disabled={reloading}
        onClick={() => {
          setReloading(true);
          const url = new URL(window.location.href);
          url.searchParams.set(RELOAD_PARAM, available);
          window.location.replace(url);
        }}
        className="rounded-xl bg-primary-green px-4 py-2 text-sm font-bold text-black hover:bg-primary-green-hover disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
      >
        {reloading ? "در حال به‌روزرسانی…" : "به‌روزرسانی"}
      </button>
    </div>
  );
}
