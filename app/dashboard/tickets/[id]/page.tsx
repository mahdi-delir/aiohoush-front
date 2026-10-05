import type { Metadata } from "next";
import TicketThread from "@/components/dash/tickets/ticket-thread";

export const metadata: Metadata = {
  title: "تیکت | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TicketThread ticketId={id} />;
}
