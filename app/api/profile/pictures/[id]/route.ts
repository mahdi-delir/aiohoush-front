import { NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetchDjango(`/auth/profile/pictures/${id}/`, { method: "DELETE" });
  const payload = await response.json();
  return NextResponse.json(payload.data ?? payload, { status: response.status });
}
