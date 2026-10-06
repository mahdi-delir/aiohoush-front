import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// batch بازه‌های دیده‌شدهٔ ویدئوی هدیه
export async function POST(
  request: Request,
  context: { params: Promise<{ watchId: string }> },
) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const { watchId } = await context.params;
  if (!UUID_PATTERN.test(watchId)) return invalidIdResponse();

  return forwardDjangoResponse(
    await fetchDjango(`/course/gift-watches/${watchId}/events/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    }),
  );
}
