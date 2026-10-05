"use client";

import { useCallback, useEffect, useState } from "react";

import type { MessageDraft, TicketDetail } from "@/types/ticket";
import MessageComposer from "./message-composer";
import {
  appendDraft,
  formatTicketDate,
  statusStyles,
  ticketFileUrl,
} from "./ticket-utils";
import { formatVoiceDuration } from "./voice-recorder";

export default function TicketThread({ ticketId }: { ticketId: string }) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch(`/api/tickets/${ticketId}`, { credentials: "same-origin" });
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.success) {
      setError(body?.message || "دریافت تیکت ممکن نشد.");
      return;
    }

    setError(null);
    setTicket(body.data);
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function send(draft: MessageDraft) {
    const formData = new FormData();
    appendDraft(formData, draft);

    const response = await fetch(`/api/tickets/${ticketId}/messages`, {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.success) {
      throw new Error(body?.message || "ارسال پیام با خطا مواجه شد.");
    }

    await load();
    return true;
  }

  async function close() {
    if (!window.confirm("تیکت بسته شود؟ بعد از بستن، امکان ارسال پیام در این تیکت نیست.")) return;

    setClosing(true);
    const response = await fetch(`/api/tickets/${ticketId}/close`, {
      method: "POST",
      credentials: "same-origin",
    });
    const body = await response.json().catch(() => null);
    setClosing(false);

    if (!response.ok || !body?.success) {
      setError(body?.message || "بستن تیکت ممکن نشد.");
      return;
    }

    await load();
  }

  if (error && !ticket) {
    return <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{error}</p>;
  }

  if (!ticket) {
    return <p role="status" className="p-6 text-sm text-text-muted">در حال دریافت تیکت…</p>;
  }

  const isClosed = ticket.status === "closed";

  return (
    <div className="space-y-5 pb-10 pt-3 text-text-primary">
      <section className="rounded-square bg-card-bg p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-8 wrap-anywhere">{ticket.subject}</h1>
            <p className="mt-1 text-xs leading-6 text-text-muted">
              <bdi>#{ticket.id.toLocaleString("fa-IR")}</bdi> · {ticket.departmentLabel}
              {ticket.department === "mentor" || ticket.department === "teacher"
                ? ` · ${ticket.recipient}`
                : ""}
              {ticket.courseTitle ? ` · ${ticket.courseTitle}` : ""}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${statusStyles[ticket.status]}`}>
            {ticket.statusLabel}
          </span>
        </div>
      </section>

      <ol className="space-y-3" aria-label="پیام‌های تیکت">
        {ticket.messages.map((message) => (
          <li
            key={message.id}
            className={`flex ${message.isMine ? "justify-start" : "justify-end"}`}
          >
            <article
              className={`max-w-[85%] rounded-3xl p-4 ${
                message.isMine
                  ? "rounded-ss-md bg-element-bg"
                  : "rounded-se-md border border-primary-green/20 bg-approve-bg/50"
              }`}
            >
              <header className="mb-2 flex items-center gap-2 text-xs text-text-muted">
                <span className="font-bold text-text-primary">
                  {message.isMine ? "شما" : message.authorName}
                </span>
                <time dateTime={message.createdAt}>{formatTicketDate(message.createdAt)}</time>
              </header>

              {message.text && (
                <p className="text-sm leading-7 whitespace-pre-wrap wrap-anywhere">{message.text}</p>
              )}

              {message.voice && (
                <div className="mt-2 flex items-center gap-2">
                  <audio
                    controls
                    preload="none"
                    src={ticketFileUrl(message.id, "voice")}
                    className="h-9 max-w-64"
                  />
                  {message.voice.durationMs !== null && (
                    <span className="text-xs tabular-nums text-text-muted">
                      {formatVoiceDuration(message.voice.durationMs)}
                    </span>
                  )}
                </div>
              )}

              {message.attachment && (
                <a
                  href={ticketFileUrl(message.id, "attachment")}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1.5 text-xs hover:text-approve"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden="true">
                    <path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4" />
                  </svg>
                  <span dir="ltr" className="max-w-48 truncate">{message.attachment.name}</span>
                </a>
              )}
            </article>
          </li>
        ))}
      </ol>

      {error && <p role="alert" className="text-xs text-danger">{error}</p>}

      {isClosed ? (
        <p className="rounded-square bg-card-bg p-5 text-center text-sm leading-7 text-text-muted">
          این تیکت بسته شده است. برای ادامه، تیکت جدید ثبت کنید.
        </p>
      ) : (
        <section className="space-y-3 rounded-square bg-card-bg p-5">
          <MessageComposer submitLabel="ارسال" onSubmit={send} />
          <div className="border-t border-white/10 pt-3 text-center">
            <button
              type="button"
              onClick={close}
              disabled={closing}
              className="text-xs text-text-muted hover:text-danger disabled:opacity-50"
            >
              {closing ? "در حال بستن…" : "بستن تیکت"}
            </button>
            <p className="mt-1 text-xs leading-6 text-text-muted">
              تیکت‌ها یک هفته پس از آخرین پیام، خودکار بسته می‌شوند.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
