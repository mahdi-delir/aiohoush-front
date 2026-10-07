import { NextRequest, NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";
import { rejectUntrustedOrigin } from "@/lib/bff";

async function proxy(response: Response) {
  const payload = await response.json();
  return NextResponse.json(payload.data ?? payload, { status: response.status });
}

export async function GET() { return proxy(await fetchDjango("/auth/profile/")); }

export async function PATCH(request: NextRequest) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  return proxy(await fetchDjango("/auth/profile/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await request.json()),
  }));
}
