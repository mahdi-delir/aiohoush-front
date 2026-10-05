import 'server-only'

import { headers as nextHeaders } from "next/headers";

import { setClientIpHeaders } from "@/lib/client-ip";
function getPositiveNumberEnv(name: string): number {
  const raw = process.env[name]

  if (!raw) {
    throw new Error(`${name} is not configured`)
  }

  const value = Number(raw)

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be positive`)
  }

  return value
}


function getDjangoUrl(path: string): string {
  const base = process.env.DJANGO_API_URL

  if (!base) {
    throw new Error('DJANGO_API_URL is not configured')
  }

  return new URL(path, base).toString()
}


export async function postDjangoJson(
  path: string,
  body: unknown,
): Promise<Response> {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    getPositiveNumberEnv(
      "DJANGO_REQUEST_TIMEOUT_MS",
    ),
  );

  try {
    const incomingHeaders = new Headers(
      await nextHeaders(),
    );
    const browserUserAgent =
      incomingHeaders.get("user-agent");

    const requestHeaders = new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
    });

    if (browserUserAgent) {
      requestHeaders.set(
        "User-Agent",
        browserUserAgent,
      );
    }

    // برای throttle درخواست OTP و ثبت IP نشست
    setClientIpHeaders(
      requestHeaders,
      incomingHeaders,
    );

    return await fetch(
      getDjangoUrl(path),
      {
        method: "POST",

        headers: requestHeaders,

        body: JSON.stringify(body),

        cache: "no-store",
        signal: controller.signal,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}


export async function forwardDjangoResponse(
  response: Response,
): Promise<Response> {
  const body = await response.text()

  return new Response(
    body,
    {
      status: response.status,

      headers: {
        'Content-Type':
          response.headers.get('Content-Type')
          ?? 'application/json',
      },
    },
  )
}