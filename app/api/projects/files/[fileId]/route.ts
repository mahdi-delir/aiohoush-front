import { invalidIdResponse } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

/*
 * دانلود zip پروژه. بررسی دسترسی (صاحب پروژه، استاد دوره، مدیر) در
 * Django انجام می‌شود؛ این route فایل را با توکن کاربر stream می‌کند.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ fileId: string }> },
) {
  const { fileId } = await context.params;
  if (!/^\d+$/.test(fileId)) return invalidIdResponse();

  const response = await fetchDjango(`/project/files/${fileId}/`, { method: "GET" });
  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok || contentType.includes("application/json")) {
    return forwardDjangoResponse(response);
  }

  const headers = new Headers({
    "Content-Type": contentType || "application/zip",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });

  for (const name of ["Content-Disposition", "Content-Length"]) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }

  return new Response(response.body, { status: 200, headers });
}
