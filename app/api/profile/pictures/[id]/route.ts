import { NextResponse } from "next/server";
import { fetchDjango } from "@/lib/django";
import { invalidIdResponse, rejectUntrustedOrigin } from "@/lib/bff";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const rejected = rejectUntrustedOrigin(request);
  if (rejected) return rejected;

  const { id } = await params;
  if (!/^\d+$/.test(id)) return invalidIdResponse();

  const response = await fetchDjango(`/auth/profile/pictures/${id}/`, { method: "DELETE" });
  const payload = await response.json();
  return NextResponse.json(payload.data ?? payload, { status: response.status });
}
