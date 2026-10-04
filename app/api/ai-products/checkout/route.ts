import { NextRequest } from "next/server";

import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";
import {
  assertTrustedOrigin,
  InvalidOriginError,
} from "@/lib/security/origin";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
) {
  try {
    assertTrustedOrigin(request);
  } catch (error) {
    if (error instanceof InvalidOriginError) {
      return Response.json(
        {
          success: false,
          message: "درخواست نامعتبر است.",
          called_by: "webapp",
        },
        {
          status: 403,
        },
      );
    }

    throw error;
  }

  const body = await request.text();

  const response = await fetchDjango(
    "/order/ai-products/checkout/",
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
