"use client";

export type PushState =
  | "unsupported"
  | "ios-install"
  | "unavailable"
  | "default"
  | "denied"
  | "enabled";

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
  const registration = await navigator.serviceWorker.getRegistration("/");
  return registration ? registration.pushManager.getSubscription() : null;
}

function sameKey(subscription: PushSubscription, key: Uint8Array) {
  const current = subscription.options.applicationServerKey;
  if (!current) return true;
  const bytes = new Uint8Array(current);
  return bytes.length === key.length && bytes.every((value, index) => value === key[index]);
}

async function subscribe(registration: ServiceWorkerRegistration, key: string) {
  const serverKey = base64UrlToBytes(key);
  const existing = await registration.pushManager.getSubscription();
  if (existing && sameKey(existing, serverKey)) return existing;
  if (existing) await existing.unsubscribe().catch(() => false);
  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: serverKey,
  });
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

export async function enablePush(): Promise<PushState> {
  const key = await publicKey();
  if (!key) return "unavailable";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission === "denied" ? "denied" : "default";

  const registration = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  await navigator.serviceWorker.ready;

  await saveSubscription(await subscribe(registration, key));
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

export async function syncPush(): Promise<void> {
  if (!isPushSupported() || Notification.permission !== "granted") return;
  const key = await publicKey();
  if (!key) return;

  const registration = (await registerServiceWorker()) ?? (await navigator.serviceWorker.ready);
  await navigator.serviceWorker.ready;
  await saveSubscription(await subscribe(registration, key));
}
