import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function GET() {
  const response = await fetchDjango(
    "/course/gift-videos/",
    {
      method: "GET",
    },
  );

  return forwardDjangoResponse(response);
}