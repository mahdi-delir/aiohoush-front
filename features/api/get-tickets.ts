import "server-only";

import { fetchDjango } from "@/lib/django";
import type { ApiResponse } from "@/types/api";
import type { TicketSummary } from "@/types/ticket";

export async function getTickets(): Promise<ApiResponse<{ tickets: TicketSummary[] }> | null> {
  const response = await fetchDjango("/ticket/", { method: "GET" });
  if (!response.ok) return null;
  return (await response.json()) as ApiResponse<{ tickets: TicketSummary[] }>;
}
