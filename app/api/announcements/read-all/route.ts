import { rejectUntrustedOrigin } from "@/lib/bff";
import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  return forwardDjangoResponse(
    await fetchDjango("/announcement/read-all/", { method: "POST" }),
  );
}
