"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/button";
import { DeviceList } from "@/features/auth/components/device-list";
import { disablePush } from "@/features/push/push";
import { getActiveSessions, logoutAll, revokeSession } from "@/lib/api/auth";

const sessionsQueryKey = ["auth", "sessions"] as const;

export default function ActiveDevices() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { data: sessions, isPending, isError } = useQuery({
    queryKey: sessionsQueryKey,
    queryFn: async () => (await getActiveSessions()).data ?? [],
  });

  async function revoke(sessionId: string) {
    setBusyId(sessionId);
    setError("");
    try {
      await revokeSession(sessionId);
      await queryClient.invalidateQueries({ queryKey: sessionsQueryKey });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "خروج از دستگاه انجام نشد.");
    } finally {
      setBusyId(null);
    }
  }

  async function revokeAll() {
    if (!window.confirm("از همه‌ی دستگاه‌ها، از جمله همین دستگاه، خارج می‌شوید. ادامه می‌دهید؟")) {
      return;
    }
    setBusyId("all");
    setError("");
    try {
      await disablePush().catch(() => undefined);
      await logoutAll();
      queryClient.clear();
      router.replace("/login");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "خروج از همه‌ی دستگاه‌ها انجام نشد.");
      setBusyId(null);
    }
  }

  return (
    <section className="rounded-[2rem] bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold">دستگاه‌های فعال</h2>
      <p className="mt-2 mb-5 text-sm text-text-muted">
        دستگاه‌هایی که الان با حساب شما وارد هستند.
      </p>

      {isPending ? (
        <p className="text-sm text-text-muted">در حال دریافت...</p>
      ) : isError ? (
        <p className="text-sm text-text-muted">دریافت دستگاه‌ها ممکن نشد.</p>
      ) : (
        <DeviceList
          sessions={sessions ?? []}
          busyId={busyId}
          disabled={busyId !== null}
          onRevoke={revoke}
        />
      )}

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      <Button
        type="button"
        variant="danger"
        size="sm"
        className="mt-5"
        disabled={busyId !== null}
        onClick={revokeAll}
      >
        {busyId === "all" ? "در حال خروج..." : "خروج از همه‌ی دستگاه‌ها"}
      </Button>
    </section>
  );
}
