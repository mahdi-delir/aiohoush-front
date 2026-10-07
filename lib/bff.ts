import "server-only";

import {
  assertTrustedOrigin,
  InvalidOriginError,
} from "@/lib/security/origin";

export function rejectUntrustedOrigin(request: Request): Response | null {
  try {
    assertTrustedOrigin(request);
    return null;
  } catch (error) {
    if (error instanceof InvalidOriginError) {
      return Response.json(
        { success: false, message: "درخواست نامعتبر است.", called_by: "webapp" },
        { status: 403 },
      );
    }
    throw error;
  }
}

export function invalidIdResponse(): Response {
  return Response.json({
    success: false,
    message: "شناسه معتبر نیست.",
    called_by: "webapp",
  });
}

const INLINE_SAFE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
]);

function isInlineSafe(contentType: string) {
  return (
    INLINE_SAFE_TYPES.has(contentType) ||
    contentType.startsWith("audio/") ||
    contentType.startsWith("video/")
  );
}

export function streamDjangoFile(response: Response, fallbackType: string): Response {
  const received = (response.headers.get("Content-Type") ?? "").split(";")[0].trim().toLowerCase();
  const contentType = received || fallbackType;
  const safe = isInlineSafe(contentType);

  const headers = new Headers({
    "Content-Type": safe ? contentType : "application/octet-stream",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });

  const length = response.headers.get("Content-Length");
  if (length) headers.set("Content-Length", length);

  const disposition = response.headers.get("Content-Disposition");
  if (disposition) {
    headers.set("Content-Disposition", safe ? disposition : disposition.replace(/^\s*inline/i, "attachment"));
  } else if (!safe) {
    headers.set("Content-Disposition", "attachment");
  }

  return new Response(response.body, { status: 200, headers });
}
