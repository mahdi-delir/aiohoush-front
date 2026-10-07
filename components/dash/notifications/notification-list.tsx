"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { unreadCountQueryKey } from "@/features/announcements/use-unread-count";
import type { AnnouncementInbox, AnnouncementItem } from "@/types/announcement";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green";

const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

function isInternal(link: string) {
  return /^\/(?![/\\])/.test(link) && !/[\\\s\u0000-\u001f]/.test(link);
}

function safeExternal(link: string): string | null {
  try {
    const url = new URL(link);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function NotificationCard({
  item,
  onRead,
}: {
  item: AnnouncementItem;
  onRead: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const external = item.link && !isInternal(item.link) ? safeExternal(item.link) : null;

  function toggle() {
    setOpen((value) => !value);
    if (!item.read) onRead(item.id);
  }

  return (
    <article
      className={`rounded-icon border p-4 motion-safe:transition-colors motion-safe:duration-200 ${
        item.read ? "border-white/5 bg-card-bg" : "border-primary-green/30 bg-approve-bg/40"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={`flex w-full items-start gap-3 text-right ${focusClasses}`}
      >
        <span
          aria-hidden="true"
          className={`mt-2 size-2 shrink-0 rounded-full ${item.read ? "bg-transparent" : "bg-primary-green"}`}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-7 font-bold wrap-anywhere">
            {item.title}
            {!item.read && <span className="sr-only"> (خوانده‌نشده)</span>}
          </span>
          <span className="mt-1 block text-xs text-text-muted">
            {item.sender} · <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
          </span>
          {!open && (
            <span className="mt-2 line-clamp-2 block text-sm leading-7 text-text-muted wrap-anywhere">
              {item.body}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="mt-3 border-t border-white/5 pt-3 motion-safe:animate-[splash-in_250ms_ease-out]">
          <p className="text-sm leading-8 whitespace-pre-wrap wrap-anywhere">{item.body}</p>
          {item.link && isInternal(item.link) && (
            <Link
              href={item.link}
              className={`mt-3 inline-block rounded-full bg-primary-green px-4 py-2 text-xs font-bold text-black hover:bg-primary-green-hover ${focusClasses}`}
            >
              مشاهده
            </Link>
          )}
          {external && (
            <a
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-block rounded-full bg-primary-green px-4 py-2 text-xs font-bold text-black hover:bg-primary-green-hover ${focusClasses}`}
            >
              مشاهده
            </a>
          )}
        </div>
      )}
    </article>
  );
}

export default function NotificationList() {
  const queryClient = useQueryClient();
  const [data, setData] = useState<AnnouncementInbox | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (target: number) => {
    const response = await fetch(`/api/announcements?page=${target}`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.success) {
      setError(body?.message || "دریافت اعلان‌ها ممکن نشد.");
      return;
    }
    setError(null);
    setData(body.data as AnnouncementInbox);
  }, []);

  useEffect(() => {
    void load(page);
  }, [load, page]);

  function setUnread(count: number) {
    queryClient.setQueryData(unreadCountQueryKey, count);
  }

  async function markRead(id: number) {
    setData((current) =>
      current && {
        ...current,
        unreadCount: Math.max(0, current.unreadCount - 1),
        items: current.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
      },
    );

    const response = await fetch(`/api/announcements/${id}/read`, {
      method: "POST",
      credentials: "same-origin",
    });
    const body = await response.json().catch(() => null);
    if (body?.success) setUnread(Number(body.data?.unreadCount) || 0);
  }

  async function markAll() {
    setBusy(true);
    const response = await fetch("/api/announcements/read-all", {
      method: "POST",
      credentials: "same-origin",
    });
    const body = await response.json().catch(() => null);
    setBusy(false);

    if (!body?.success) {
      setError(body?.message || "انجام نشد.");
      return;
    }
    setUnread(0);
    setData((current) =>
      current && {
        ...current,
        unreadCount: 0,
        items: current.items.map((item) => ({ ...item, read: true })),
      },
    );
  }

  return (
    <div className="space-y-4 pt-3 pb-10 text-text-primary">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-square bg-card-bg p-5">
        <div>
          <h1 className="text-lg font-bold">اعلان‌ها</h1>
          <p className="mt-1 text-xs text-text-muted">
            {data
              ? data.unreadCount
                ? `${data.unreadCount.toLocaleString("fa-IR")} اعلان خوانده‌نشده`
                : "همهٔ اعلان‌ها را خوانده‌اید."
              : " "}
          </p>
        </div>
        {data && data.unreadCount > 0 && (
          <button
            type="button"
            onClick={markAll}
            disabled={busy}
            className={`rounded-full border border-white/10 px-4 py-2 text-xs hover:bg-element-bg disabled:opacity-50 ${focusClasses}`}
          >
            {busy ? "…" : "همه را خواندم"}
          </button>
        )}
      </section>

      {error && !data ? (
        <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{error}</p>
      ) : !data ? (
        <ul aria-hidden="true" className="space-y-3">
          {[0, 1, 2].map((item) => (
            <li key={item} className="h-24 animate-pulse rounded-icon bg-card-bg" />
          ))}
        </ul>
      ) : data.items.length === 0 ? (
        <p className="rounded-square bg-card-bg px-6 py-12 text-center text-sm text-text-muted">
          هنوز اعلانی برای شما ارسال نشده است.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.items.map((item) => (
            <li key={item.id}>
              <NotificationCard item={item} onRead={markRead} />
            </li>
          ))}
        </ul>
      )}

      {data && data.pageCount > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="صفحه‌بندی">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className={`rounded-xl bg-element-bg px-4 py-2 text-sm disabled:opacity-40 ${focusClasses}`}
          >
            قبلی
          </button>
          <span className="text-xs text-text-muted">
            صفحهٔ {data.page.toLocaleString("fa-IR")} از {data.pageCount.toLocaleString("fa-IR")}
          </span>
          <button
            type="button"
            disabled={page >= data.pageCount}
            onClick={() => setPage((value) => value + 1)}
            className={`rounded-xl bg-element-bg px-4 py-2 text-sm disabled:opacity-40 ${focusClasses}`}
          >
            بعدی
          </button>
        </nav>
      )}
    </div>
  );
}
