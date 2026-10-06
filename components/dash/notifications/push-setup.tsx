"use client";

import { useEffect, useState } from "react";

import { disablePush, enablePush, getPushState, type PushState } from "@/features/push/push";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green";

/** کارت فعال‌سازی نوتیفیکیشن روی همین دستگاه */
export default function PushSetup() {
  const [state, setState] = useState<PushState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPushState()
      .then((value) => active && setState(value))
      .catch(() => active && setState("unsupported"));
    return () => {
      active = false;
    };
  }, []);

  async function enable() {
    setBusy(true);
    setError(null);
    try {
      setState(await enablePush());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "فعال‌سازی ممکن نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    await disablePush().catch(() => undefined);
    setState("default");
    setBusy(false);
  }

  // پشتیبانی‌نشده یا سرور آماده نیست: کارتی نشان نده.
  if (state === null || state === "unsupported" || state === "unavailable") return null;

  return (
    <section
      aria-label="نوتیفیکیشن روی این دستگاه"
      className="rounded-square border border-primary-green/20 bg-card-bg p-5 text-sm leading-7"
    >
      {state === "enabled" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>نوتیفیکیشن روی این دستگاه فعال است؛ اعلان‌های جدید حتی وقتی اپ بسته است می‌رسند.</p>
          <button
            type="button"
            onClick={disable}
            disabled={busy}
            className={`rounded-full border border-white/10 px-4 py-2 text-xs text-text-muted hover:text-text-primary disabled:opacity-50 ${focusClasses}`}
          >
            غیرفعال کردن
          </button>
        </div>
      ) : state === "default" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            اعلان‌ها را روی گوشی هم دریافت کن تا چیزی را از دست ندهی.
          </p>
          <button
            type="button"
            onClick={enable}
            disabled={busy}
            className={`rounded-full bg-primary-green px-4 py-2 text-xs font-bold text-black hover:bg-primary-green-hover disabled:opacity-50 ${focusClasses}`}
          >
            {busy ? "در حال فعال‌سازی…" : "فعال‌سازی نوتیفیکیشن"}
          </button>
        </div>
      ) : state === "ios-install" ? (
        <p>
          برای دریافت نوتیفیکیشن روی آیفون، اول آیوهوش را به صفحهٔ اصلی اضافه کن (در Safari
          دکمهٔ اشتراک‌گذاری ← <bdi>Add to Home Screen</bdi>) و اپ را از همان آیکون باز کن.
        </p>
      ) : (
        <p>
          اجازهٔ نوتیفیکیشن برای آیوهوش بسته شده است. برای فعال کردن، از تنظیمات مرورگر یا گوشی
          بخش اعلان‌های آیوهوش را روشن کن و این صفحه را دوباره باز کن.
        </p>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-red-300">{error}</p>}
    </section>
  );
}
