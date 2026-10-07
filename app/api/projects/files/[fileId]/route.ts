import { invalidIdResponse, streamDjangoFile } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

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

  return streamDjangoFile(response, "application/zip");
}
