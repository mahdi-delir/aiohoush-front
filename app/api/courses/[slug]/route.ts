import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { slug } = await context.params;

  const response = await fetchDjango(
    `/course/catalog/${encodeURIComponent(slug)}/`,
    {
      method: "GET",
    },
  );

  return forwardDjangoResponse(response);
}