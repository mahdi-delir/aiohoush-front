import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page");
  const query = page && /^\d+$/.test(page) ? `?page=${page}` : "";

  return forwardDjangoResponse(await fetchDjango(`/announcement/${query}`, { method: "GET" }));
}
