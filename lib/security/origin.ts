import "server-only";


export class InvalidOriginError extends Error {
  constructor() {
    super("Invalid request origin");
  }
}



export function assertTrustedOrigin(
  request: Request,
): void {
  const configuredOrigins =
    process.env.APP_ORIGINS ||
    process.env.APP_ORIGIN;

  if (!configuredOrigins) {
    throw new Error(
      "APP_ORIGINS is not configured",
    );
  }

  const allowedOrigins = configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const origin =
    request.headers.get("origin");

  if (
    origin &&
    allowedOrigins.includes(origin)
  ) {
    return;
  }

  const referer =
    request.headers.get("referer");

  if (referer) {
    try {
      const refererOrigin =
        new URL(referer).origin;

      if (
        allowedOrigins.includes(refererOrigin)
      ) {
        return;
      }
    } catch {}
  }

  throw new InvalidOriginError();
}