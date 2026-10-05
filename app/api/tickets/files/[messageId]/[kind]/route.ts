import { invalidIdResponse } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

/*
 * پیوست یا پیام صوتی تیکت. بررسی دسترسی در Django انجام می‌شود؛
 * این route فایل را با توکن کاربر می‌گیرد و stream می‌کند.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ messageId: string; kind: string }> },
) {
  const { messageId, kind } = await context.params;

  if (!/^\d+$/.test(messageId) || (kind !== "attachment" && kind !== "voice")) {
    return invalidIdResponse();
  }

  const response = await fetchDjango(`/ticket/files/${messageId}/${kind}/`, {
    method: "GET",
  });

  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok || contentType.includes("application/json")) {
    return forwardDjangoResponse(response);
  }

  const headers = new Headers({
    "Content-Type": contentType || "application/octet-stream",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });

  for (const name of ["Content-Disposition", "Content-Length"]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(response.body, { status: 200, headers });
}
