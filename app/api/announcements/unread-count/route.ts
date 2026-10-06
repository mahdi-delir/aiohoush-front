import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function GET() {
  return forwardDjangoResponse(
    await fetchDjango("/announcement/unread-count/", { method: "GET" }),
  );
}
