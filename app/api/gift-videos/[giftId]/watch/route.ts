import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ giftId: string }> },
) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const { giftId } = await context.params;
  if (!/^\d+$/.test(giftId)) return invalidIdResponse();

  return forwardDjangoResponse(
    await fetchDjango(`/course/gift-videos/${giftId}/watch/`, { method: "POST" }),
  );
}
