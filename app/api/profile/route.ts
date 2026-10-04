import { NextRequest, NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";

export async function GET() {
  const response = await fetchDjango("/auth/me/");
  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  const response = await fetchDjango("/auth/profile/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  return NextResponse.json(data, {
    status: response.status,
  });
}