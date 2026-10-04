import { NextRequest } from "next/server";

import { fetchDjango } from "@/lib/django";
import { forwardDjangoResponse } from "@/lib/django-public";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
) {
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