import type { Metadata } from "next";
import NewTicketForm from "@/components/dash/tickets/new-ticket-form";

export const metadata: Metadata = {
  title: "تیکت جدید | آیوهوش",
  robots: { index: false, follow: false },
};

export default function NewTicketPage() {
  return <NewTicketForm />;
}
