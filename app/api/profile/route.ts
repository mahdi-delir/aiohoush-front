import { NextRequest, NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";

async function proxy(response: Response) {
  const payload = await response.json();
  return NextResponse.json(payload.data ?? payload, { status: response.status });
}

export async function GET() { return proxy(await fetchDjango("/auth/profile/")); }

export async function PATCH(request: NextRequest) {
  return proxy(await fetchDjango("/auth/profile/", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(await request.json()),
  }));
}
