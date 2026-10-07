import { NextRequest, NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";
import { rejectUntrustedOrigin } from "@/lib/bff";

async function proxy(response: Response) {
  const text = await response.text();

  if (!text.trim()) {
    return NextResponse.json(
      {
        detail: `پاسخ خالی از سرور دریافت شد. status=${response.status}`,
      },
      {
        status: response.status || 500,
      },
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(text);
  } catch {
    return NextResponse.json(
      {
        detail: text || "پاسخ نامعتبر از سرور دریافت شد.",
      },
      {
        status: response.status || 500,
      },
    );
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload
  ) {
    return NextResponse.json(
      (payload as { data: unknown }).data,
      {
        status: response.status,
      },
    );
  }

  return NextResponse.json(payload, {
    status: response.status,
  });
}

export async function GET() {
  const response = await fetchDjango(
    "/auth/profile/pictures/",
  );

  return proxy(response);
}

export async function POST(request: NextRequest) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const formData = await request.formData();

  const response = await fetchDjango(
    "/auth/profile/pictures/",
    {
      method: "POST",
      body: formData,
    },
  );

  return proxy(response);
}