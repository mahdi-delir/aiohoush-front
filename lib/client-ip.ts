import "server-only";

import { isIP } from "node:net";

/*
 * IP واقعی کاربر برای ارسال به جنگو.
 *
 * دو حالت پشتیبانی می‌شود (با CLIENT_IP_HEADER):
 *
 * - x-real-ip (پیش‌فرض): proxy جلوی Next این هدر را با IP اتصال
 *   بازنویسی می‌کند، پس مقدار ارسالی کاربر به اینجا نمی‌رسد.
 *
 * - x-forwarded-for: proxy هر لایه IP اتصال را به «انتهای» این هدر
 *   اضافه می‌کند؛ ابتدای هدر را کاربر می‌تواند جعل کند. پس از انتها
 *   می‌شماریم: TRUSTED_PROXY_COUNT تعداد proxyهای مورد اعتماد بین
 *   کاربر و Next است (پیش‌فرض ۱).
 */
const CLIENT_IP_HEADER = (
  process.env.CLIENT_IP_HEADER || "x-real-ip"
).toLowerCase();

function getTrustedProxyCount(): number {
  const value = Number(process.env.TRUSTED_PROXY_COUNT || "1");

  return Number.isInteger(value) && value > 0 ? value : 1;
}

function normalizeIp(value: string | undefined): string | null {
  const ip = value?.trim();

  if (!ip || isIP(ip) === 0) {
    return null;
  }

  return ip;
}

export function getClientIp(headers: Headers): string | null {
  const value = headers.get(CLIENT_IP_HEADER);

  if (!value) {
    return null;
  }

  if (CLIENT_IP_HEADER !== "x-forwarded-for") {
    return normalizeIp(value);
  }

  const hops = value.split(",");
  const index = hops.length - getTrustedProxyCount();

  return index >= 0 ? normalizeIp(hops[index]) : null;
}

/*
 * هدرهایی که جنگو با آن IP کاربر را از BFF می‌پذیرد.
 * جنگو فقط وقتی به IP اعتماد می‌کند که کلید مشترک درست باشد.
 */
export function setClientIpHeaders(
  target: Headers,
  incomingHeaders: Headers,
): void {
  const secret = process.env.BFF_SHARED_SECRET;
  const clientIp = getClientIp(incomingHeaders);

  if (!secret || !clientIp) {
    return;
  }

  target.set("X-Aiohoush-BFF-Token", secret);
  target.set("X-Aiohoush-Client-IP", clientIp);
}
