"use client";

import { useEffect } from "react";

import { disablePush } from "@/features/push/push";

const IGNORED_PATHS = ["/api/auth/login/", "/api/auth/logout", "/api/push/"];

function requestPath(input: RequestInfo | URL) {
  const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(raw, window.location.href);
  return url.origin === window.location.origin ? url.pathname : null;
}

function withTimeout(task: Promise<unknown>, ms: number) {
  return Promise.race([task.catch(() => undefined), new Promise((resolve) => setTimeout(resolve, ms))]);
}

export default function SessionGuard() {
  useEffect(() => {
    const original = window.fetch;
    let redirecting = false;

    const guarded: typeof window.fetch = async (input, init) => {
      const response = await original(input, init);
      const path = requestPath(input);

      if (
        response.status === 401 &&
        !redirecting &&
        path?.startsWith("/api/") &&
        !IGNORED_PATHS.some((prefix) => path.startsWith(prefix))
      ) {
        redirecting = true;
        await withTimeout(disablePush(), 1500);
        window.location.replace("/login");
      }

      return response;
    };

    window.fetch = guarded;

    return () => {
      if (window.fetch === guarded) window.fetch = original;
    };
  }, []);

  return null;
}
