import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { sessionId } = await context.params;
  const formData = await request.formData();

  const response = await fetchDjango(
    `/course/sessions/${sessionId}/homework/`,
    {
      method: "POST",
      body: formData,
    },
  );

  return forwardDjangoResponse(response);
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const { sessionId } = await context.params;

  const response = await fetchDjango(
    `/course/sessions/${sessionId}/homework/`,
    {
      method: "GET",
    },
  );

  return forwardDjangoResponse(response);
}