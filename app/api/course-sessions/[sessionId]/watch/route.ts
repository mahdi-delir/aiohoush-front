import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";
import {
  assertTrustedOrigin,
  InvalidOriginError,
} from "@/lib/security/origin";

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

  const { sessionId } = await context.params;

  if (!/^\d+$/.test(sessionId)) {
    return Response.json({
      success: false,
      message: "شناسه جلسه معتبر نیست.",
      called_by: "webapp",
    });
  }

  const response = await fetchDjango(
    `/course/sessions/${sessionId}/watch/`,
    {
      method: "POST",
    },
  );

  return forwardDjangoResponse(response);
}
