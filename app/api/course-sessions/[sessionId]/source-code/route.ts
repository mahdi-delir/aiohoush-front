import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

/*
 * دانلود سورس کد جلسه.
 * بررسی دسترسی در Django انجام می‌شود؛ این route فقط فایل را
 * با توکن کاربر از backend می‌گیرد و stream می‌کند.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { sessionId } = await context.params;

  if (!/^\d+$/.test(sessionId)) {
    return Response.json({
      success: false,
      message: "شناسه جلسه معتبر نیست.",
      called_by: "webapp",
    });
  }

  const response = await fetchDjango(
    `/course/sessions/${sessionId}/source-code/`,
    {
      method: "GET",
    },
  );

  // خطاها (success=false یا خطای سرور) به همان شکل JSON برمی‌گردند.
  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok || contentType.includes("application/json")) {
    return forwardDjangoResponse(response);
  }

  const headers = new Headers({
    "Content-Type":
      response.headers.get("Content-Type") ??
      "application/octet-stream",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });

  for (const name of [
    "Content-Disposition",
    "Content-Length",
  ]) {
    const value = response.headers.get(name);

    if (value) {
      headers.set(name, value);
    }
  }

  return new Response(response.body, {
    status: 200,
    headers,
  });
}
