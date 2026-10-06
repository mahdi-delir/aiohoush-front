import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return invalidIdResponse();

  return forwardDjangoResponse(
    await fetchDjango(`/announcement/${id}/read/`, { method: "POST" }),
  );
}
