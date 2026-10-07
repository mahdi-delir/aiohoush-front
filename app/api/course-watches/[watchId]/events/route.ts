import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";
import {
  assertTrustedOrigin,
  InvalidOriginError,
} from "@/lib/security/origin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    watchId: string;
  }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    assertTrustedOrigin(request);
  } catch (error) {
    if (error instanceof InvalidOriginError) {
      return Response.json(
        { success: false, message: "درخواست نامعتبر است.", called_by: "webapp" },
        { status: 403 },
      );
    }
    throw error;
  }

  const { watchId } = await context.params;

  if (!UUID_PATTERN.test(watchId)) {
    return Response.json({
      success: false,
      message: "شناسه تماشا معتبر نیست.",
      called_by: "webapp",
    });
  }

  const body = await request.text();

  const response = await fetchDjango(
    `/course/watches/${watchId}/events/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    },
  );

  return forwardDjangoResponse(response);
}
