import "server-only";

import { isIP } from "node:net";

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
