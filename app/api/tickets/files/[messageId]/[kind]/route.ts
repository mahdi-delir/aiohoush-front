import { invalidIdResponse, streamDjangoFile } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

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

  return streamDjangoFile(response, "application/octet-stream");
}
