import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

const ALLOWED_PARAMS = ["kind", "q", "technology", "page"] as const;

export async function GET(request: Request) {
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams();

  for (const name of ALLOWED_PARAMS) {
    const value = incoming.get(name);
    if (value) params.set(name, value.slice(0, 100));
  }

  const query = params.toString();

  return forwardDjangoResponse(
    await fetchDjango(`/project/${query ? `?${query}` : ""}`, { method: "GET" }),
  );
}
