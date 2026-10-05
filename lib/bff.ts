import "server-only";

import {
  assertTrustedOrigin,
  InvalidOriginError,
} from "@/lib/security/origin";

/**
 * بررسی Origin برای درخواست‌های تغییردهنده؛ پاسخ خطا یا null.
 */
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
