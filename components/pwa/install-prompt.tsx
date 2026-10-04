"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/button";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const DISMISS_KEY = "aiohoush-pwa-dismissed-until";

export default function InstallPrompt() {
  const pathname = usePathname();

  const allowed =
    pathname === "/login" ||
    pathname === "/login/" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const [installEvent, setInstallEvent] =
    useState<InstallEvent | null>(null);

  const [ios, setIos] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const nav = navigator as Navigator & { standalone?: boolean };

    function updateDisplayMode() {
      setInstalled(media.matches || nav.standalone === true);
    }

    updateDisplayMode();

    setIos(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" &&
          navigator.maxTouchPoints > 1),
    );

    try {
      const dismissedUntil = Number(
        localStorage.getItem(DISMISS_KEY) || 0,
      );

      setDismissed(Date.now() < dismissedUntil);
    } catch {
      setDismissed(false);
    }

    function beforeInstall(event: Event) {
      event.preventDefault();
      setInstallEvent(event as InstallEvent);
    }

    function afterInstall() {
      setInstalled(true);
      setInstallEvent(null);
    }

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", afterInstall);
    media.addEventListener("change", updateDisplayMode);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", afterInstall);
      media.removeEventListener("change", updateDisplayMode);
    };
  }, []);

  function dismiss() {
    setDismissed(true);

    try {
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + 7 * 24 * 60 * 60 * 1000),
      );
    } catch {
      // در مرورگرهایی که ذخیره‌سازی مسدود است،
      // فقط در همین بازدید بسته می‌شود.
    }
  }

  async function install() {
    if (!installEvent || busy) return;

    setBusy(true);
    setError("");

    try {
      await installEvent.prompt();

      const choice = await installEvent.userChoice;

      if (choice.outcome === "accepted") {
        setDismissed(true);
      } else {
        dismiss();
      }
    } catch {
      setError("نصب انجام نشد؛ از منوی مرورگر اقدام کن.");
    } finally {
      setInstallEvent(null);
      setBusy(false);
    }
  }

  if (
    !allowed ||
    installed ||
    dismissed ||
    (!installEvent && !ios && !error)
  ) {
    return null;
  }

  return (
    <aside
      dir="rtl"
      aria-label="نصب آیوهوش"
      className="fixed inset-x-4 bottom-6 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-card-bg p-5 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">آیوهوش همیشه همراه شما</h2>
          <p className="mt-2 text-sm leading-7 text-text-muted">
            آیوهوش را به صفحه اصلی دستگاهت اضافه کن تا
            راحت‌تر به پنلت دسترسی داشته باشی.
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="بستن پیام نصب"
          className="shrink-0 rounded-lg px-2 py-1 text-text-muted"
        >
          ✕
        </button>
      </div>

      {installEvent ? (
        <div className="mt-4 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={install}
          >
            {busy ? "در حال نصب…" : "نصب آیوهوش"}
          </Button>

          <button
            type="button"
            onClick={dismiss}
            className="px-3 text-sm text-text-muted"
          >
            فعلاً نه
          </button>
        </div>
      ) : ios ? (
        <p className="mt-4 text-sm leading-7">
          در Safari منوی اشتراک‌گذاری
          {" (Share) "}
          را باز کن و گزینه
          {" "}
          <bdi>Add to Home Screen</bdi>
          {" "}
          را بزن.
        </p>
      ) : null}

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}
    </aside>
  );
}