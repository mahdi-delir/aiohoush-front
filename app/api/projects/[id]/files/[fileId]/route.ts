import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; fileId: string }> },
) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const { id, fileId } = await context.params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(fileId)) return invalidIdResponse();

  return forwardDjangoResponse(
    await fetchDjango(`/project/${id}/files/${fileId}/`, { method: "DELETE" }),
  );
}
