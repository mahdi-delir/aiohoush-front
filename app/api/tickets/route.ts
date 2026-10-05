import { rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function GET() {
  return forwardDjangoResponse(await fetchDjango("/ticket/", { method: "GET" }));
}

// ایجاد تیکت (multipart: متن، پیوست، پیام صوتی)
export async function POST(request: Request) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const formData = await request.formData();

  return forwardDjangoResponse(
    await fetchDjango("/ticket/", { method: "POST", body: formData }),
  );
}
