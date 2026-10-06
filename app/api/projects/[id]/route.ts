import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

async function projectId(context: Context) {
  const { id } = await context.params;
  return /^\d+$/.test(id) ? id : null;
}

export async function GET(_request: Request, context: Context) {
  const id = await projectId(context);
  if (!id) return invalidIdResponse();

  return forwardDjangoResponse(await fetchDjango(`/project/${id}/`, { method: "GET" }));
}

export async function PATCH(request: Request, context: Context) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const id = await projectId(context);
  if (!id) return invalidIdResponse();

  return forwardDjangoResponse(
    await fetchDjango(`/project/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
    }),
  );
}

export async function DELETE(request: Request, context: Context) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const id = await projectId(context);
  if (!id) return invalidIdResponse();

  return forwardDjangoResponse(await fetchDjango(`/project/${id}/`, { method: "DELETE" }));
}
