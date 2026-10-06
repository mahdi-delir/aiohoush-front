"use client";

/*
 * Web Push در مرورگر: ثبت service worker، گرفتن اجازه و ثبت اشتراک
 * این دستگاه در سرور. روی آیفون فقط داخل اپ نصب‌شده (iOS 16.4+) کار می‌کند.
 */

export type PushState =
  | "unsupported" // مرورگر پشتیبانی نمی‌کند
  | "ios-install" // آیفون: اول باید اپ نصب شود
  | "unavailable" // سرور هنوز کلید ندارد
  | "default" // هنوز اجازه نخواسته‌ایم
  | "denied" // کاربر اجازه نداده
  | "enabled"; // فعال روی همین دستگاه

const SW_URL = "/sw.js";

export function isIos() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isStandalone() {
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

export function isPushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function base64UrlToBytes(value: string) {
  const padded = (value + "=".repeat((4 - (value.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return bytes;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register(SW_URL, { scope: "/", updateViaCache: "none" });
}

async function publicKey(): Promise<string | null> {
  const response = await fetch("/api/push/public-key", { credentials: "same-origin", cache: "no-store" });
  const body = await response.json().catch(() => null);
  return response.ok && body?.success ? (body.data?.publicKey as string) : null;
}

async function saveSubscription(subscription: PushSubscription) {
  const response = await fetch("/api/push/subscribe", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription.toJSON()),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "ثبت نوتیفیکیشن روی سرور ممکن نشد.");
  }
}

async function currentSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function getPushState(): Promise<PushState> {
  if (!isPushSupported()) {
    return isIos() && !isStandalone() ? "ios-install" : "unsupported";
  }
  if (Notification.permission === "denied") return "denied";
  if (!(await publicKey())) return "unavailable";
  if (Notification.permission !== "granted") return "default";

  await registerServiceWorker();
  return (await currentSubscription()) ? "enabled" : "default";
}

/** باید با کلیک کاربر صدا زده شود (روی آیفون الزامی است). */
export async function enablePush(): Promise<PushState> {
  const key = await publicKey();
  if (!key) return "unavailable";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "default";

  const registration = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  await navigator.serviceWorker.ready;

  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToBytes(key),
    }));

  await saveSubscription(subscription);
  return "enabled";
}

export async function disablePush(): Promise<void> {
  if (!isPushSupported()) return;
  const subscription = await currentSubscription();
  if (!subscription) return;

  await fetch("/api/push/unsubscribe", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  }).catch(() => undefined);
  await subscription.unsubscribe().catch(() => false);
}

/**
 * با هر باز شدن اپ: اگر اجازه داده شده، اشتراک این دستگاه دوباره به
 * کاربر فعلی وصل می‌شود (مثلاً بعد از ورود با حساب دیگر).
 */
export async function syncPush(): Promise<void> {
  if (!isPushSupported() || Notification.permission !== "granted") return;
  const key = await publicKey();
  if (!key) return;

  const registration = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToBytes(key),
    }));
  await saveSubscription(subscription);
}
