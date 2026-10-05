import "server-only";

import { headers as nextHeaders } from "next/headers";

import { getSessionId } from "@/lib/auth/cookies";
import { setClientIpHeaders } from "@/lib/client-ip";

import {
  AuthSessionMissingError,
  RefreshRejectedError,
  refreshSessionSingleFlight,
} from "@/lib/auth/refresh";

import {
  loadBffSession,
} from "@/lib/auth/session-store";


interface DjangoFetchOptions extends RequestInit {
  retryOn401?: boolean;
}


function buildHeaders(
  initialHeaders: HeadersInit | undefined,
  access: string | undefined,
  incomingHeaders: Headers,
): Headers {
  const headers = new Headers(initialHeaders);
  const browserUserAgent =
    incomingHeaders.get("user-agent");

  setClientIpHeaders(headers, incomingHeaders);

  if (access) {
    headers.set(
      "Authorization",
      `Bearer ${access}`,
    );
  }

  if (
    browserUserAgent &&
    !headers.has("User-Agent")
  ) {
    headers.set(
      "User-Agent",
      browserUserAgent,
    );
  }

  return headers;
}


export async function fetchDjango(
  path: string,
  options: DjangoFetchOptions = {},
): Promise<Response> {
  const {
    retryOn401 = true,
    ...fetchOptions
  } = options;

  const incomingHeaders = new Headers(
    await nextHeaders(),
  );

  const sessionId =
    await getSessionId();

  const authSession =
    sessionId
      ? await loadBffSession(sessionId)
      : null;

  const firstResponse = await fetch(
    `${process.env.DJANGO_API_URL}${path}`,
    {
      ...fetchOptions,

      headers: buildHeaders(
        fetchOptions.headers,
        authSession?.access,
        incomingHeaders,
      ),

      cache: "no-store",
    },
  );

  if (
    firstResponse.status !== 401 ||
    !retryOn401 ||
    !sessionId ||
    !authSession
  ) {
    return firstResponse;
  }

  try {
    const tokens =
      await refreshSessionSingleFlight(
        sessionId,
        authSession.access,
      );

    return await fetch(
      `${process.env.DJANGO_API_URL}${path}`,
      {
        ...fetchOptions,

        headers: buildHeaders(
          fetchOptions.headers,
          tokens.access,
          incomingHeaders,
        ),

        cache: "no-store",
      },
    );
  } catch (error) {
    if (
      error instanceof RefreshRejectedError ||
      error instanceof AuthSessionMissingError
    ) {
      return firstResponse;
    }

    throw error;
  }
}