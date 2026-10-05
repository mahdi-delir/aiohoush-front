import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import TicketIcon from "@/assets/puffy-icons/ticket.svg";
import {
  formatTicketDate,
  statusStyles,
} from "@/components/dash/tickets/ticket-utils";
import { getTickets } from "@/features/api/get-tickets";

export const metadata: Metadata = {
  title: "پشتیبانی | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function TicketsPage() {
  const [result] = await Promise.allSettled([getTickets()]);
  const tickets =
    result.status === "fulfilled" && result.value?.success
      ? result.value.data?.tickets ?? []
      : null;

  return (
    <div className="space-y-5 pb-10 pt-3 text-text-primary">
      <section className="flex items-center justify-between gap-4 rounded-square bg-card-bg p-5">
        <div className="flex items-center gap-3">
          <Image src={TicketIcon} alt="" width={40} height={40} />
          <div>
            <h1 className="text-lg font-bold">تیکت‌های من</h1>
            <p className="mt-1 text-xs leading-6 text-text-muted">
              سؤال یا درخواستت را برای منتور، استاد، واحد مالی یا مدیریت بفرست.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/tickets/new"
          className="shrink-0 rounded-full bg-primary-green px-4 py-2.5 text-sm font-bold text-black hover:bg-primary-green-hover"
        >
          تیکت جدید
        </Link>
      </section>

      {tickets === null ? (
        <p role="status" className="rounded-square bg-card-bg p-6 text-sm leading-7 text-text-muted">
          دریافت تیکت‌ها ممکن نشد؛ لطفاً صفحه را دوباره بارگذاری کنید.
        </p>
      ) : tickets.length === 0 ? (
        <div className="rounded-square bg-card-bg px-6 py-12 text-center">
          <Image src={TicketIcon} alt="" width={72} height={72} className="mx-auto opacity-80" />
          <p className="mt-4 text-sm leading-7 text-text-muted">
            هنوز تیکتی ثبت نکرده‌اید.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/dashboard/tickets/${ticket.id}`}
                className="block rounded-icon bg-card-bg p-4 hover:bg-element-bg focus-visible:outline-2 focus-visible:outline-approve"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-bold leading-6 wrap-anywhere">{ticket.subject}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${statusStyles[ticket.status]}`}>
                    {ticket.statusLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-6 text-text-muted">
                  {ticket.departmentLabel}
                  {ticket.department === "mentor" || ticket.department === "teacher"
                    ? ` · ${ticket.recipient}`
                    : ""}
                  {ticket.courseTitle ? ` · ${ticket.courseTitle}` : ""}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  <bdi>#{ticket.id.toLocaleString("fa-IR")}</bdi> · آخرین پیام:{" "}
                  <time dateTime={ticket.lastMessageAt}>{formatTicketDate(ticket.lastMessageAt)}</time>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
