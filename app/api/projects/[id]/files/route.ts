import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

// افزودن یک فایل zip به پروژه (multipart، فیلد «file»)
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const { id } = await context.params;
  if (!/^\d+$/.test(id)) return invalidIdResponse();

  const formData = await request.formData();

  return forwardDjangoResponse(
    await fetchDjango(`/project/${id}/files/`, { method: "POST", body: formData }),
  );
}
