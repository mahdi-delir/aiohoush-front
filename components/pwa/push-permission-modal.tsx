"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Bell from "@/assets/puffy-icons/bell.svg";
import { enablePush, getPushState, type PushState } from "@/features/push/push";

// یک بار در هر باز کردن اپ (sessionStorage با بستن اپ پاک می‌شود).
const ASKED_KEY = "aiohoush-push-asked";
// بعد از اسپلش نمایش داده شود.
const SHOW_DELAY_MS = 2000;
const ANIMATION_MS = 250;

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green";

/**
 * تا وقتی کاربر اجازهٔ نوتیفیکیشن نداده، با هر باز شدن اپ از او اجازه
 * می‌خواهد. اگر قبلاً در مرورگر «مسدود» کرده باشد (مرورگر اجازهٔ پرسیدن
 * دوباره نمی‌دهد)، راه فعال کردن از تنظیمات را نشان می‌دهد.
 */
export default function PushPermissionModal() {
  const [state, setState] = useState<"ask" | "blocked" | null>(null);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    try {
      if (sessionStorage.getItem(ASKED_KEY)) return;
    } catch {
      // بدون sessionStorage هم کار کند
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      let pushState: PushState;
      try {
        pushState = await getPushState();
      } catch {
        return;
      }
      if (cancelled) return;

      if (pushState === "default") setState("ask");
      else if (pushState === "denied") setState("blocked");
      else return;

      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    }, SHOW_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (shown) primaryRef.current?.focus();
  }, [shown]);

  function close() {
    try {
      sessionStorage.setItem(ASKED_KEY, "1");
    } catch {
      // ignore
    }
    setShown(false);
    window.setTimeout(() => setState(null), ANIMATION_MS);
  }

  async function allow() {
    setBusy(true);
    setError(null);
    try {
      const result = await enablePush();
      if (result === "enabled") {
        close();
        return;
      }
      if (result === "denied") {
        setState("blocked");
        return;
      }
      // کاربر پنجرهٔ مرورگر را بدون انتخاب بست؛ دفعهٔ بعد دوباره می‌پرسیم.
      close();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "فعال‌سازی ممکن نشد.");
    } finally {
      setBusy(false);
    }
  }

  if (!state) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-5 transition-opacity duration-250 ease-out motion-reduce:transition-none ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onKeyDown={(event) => event.key === "Escape" && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="push-modal-title"
        dir="rtl"
        className={`w-full max-w-sm rounded-square border border-primary-green/20 bg-card-bg p-6 text-center text-text-primary shadow-2xl transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
          shown ? "scale-100" : "scale-95"
        }`}
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary-green/10">
          <Image src={Bell} alt="" width={36} height={36} />
        </span>

        <h2 id="push-modal-title" className="mt-4 text-lg font-bold">
          {state === "ask" ? "اعلان‌ها را از دست نده" : "نوتیفیکیشن آیوهوش خاموش است"}
        </h2>

        {state === "ask" ? (
          <p className="mt-2 text-sm leading-7 text-text-muted">
            خبرهای کلاس، پاسخ تیکت‌ها و اطلاعیه‌های مهم را حتی وقتی اپ بسته است روی گوشی‌ات بگیر.
          </p>
        ) : (
          <p className="mt-2 text-sm leading-7 text-text-muted">
            اجازهٔ نوتیفیکیشن قبلاً بسته شده و فقط از تنظیمات قابل باز کردن است: در تنظیمات گوشی یا
            مرورگر، بخش اعلان‌ها (Notifications) را برای آیوهوش روشن کن و اپ را دوباره باز کن.
          </p>
        )}

        {error && (
          <p role="alert" className="mt-3 text-xs text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {state === "ask" ? (
            <>
              <button
                ref={primaryRef}
                type="button"
                onClick={allow}
                disabled={busy}
                className={`rounded-full bg-primary-green px-5 py-3 text-sm font-bold text-black hover:bg-primary-green-hover disabled:opacity-60 ${focusClasses}`}
              >
                {busy ? "در حال فعال‌سازی…" : "اجازه می‌دهم"}
              </button>
              <button
                type="button"
                onClick={close}
                className={`rounded-full px-5 py-2.5 text-sm text-text-muted hover:text-text-primary ${focusClasses}`}
              >
                بعداً
              </button>
            </>
          ) : (
            <button
              ref={primaryRef}
              type="button"
              onClick={close}
              className={`rounded-full bg-element-bg px-5 py-3 text-sm hover:bg-white/10 ${focusClasses}`}
            >
              متوجه شدم
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
