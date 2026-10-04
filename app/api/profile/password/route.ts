import { NextRequest, NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetchDjango("/auth/change-password/", {
    method: "POST",
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