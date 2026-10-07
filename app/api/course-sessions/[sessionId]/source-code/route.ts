import { streamDjangoFile } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

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

  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok || contentType.includes("application/json")) {
    return forwardDjangoResponse(response);
  }

  return streamDjangoFile(response, "application/octet-stream");
}
