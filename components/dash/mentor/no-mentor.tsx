"use client";

import { useState } from "react";

const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const benefits = [
  {
    title: "مسیر یادگیری شخصی",
    text: "منتور کمکت می‌کند بدانی از کجا شروع کنی و قدم بعدی چیست.",
  },
  {
    title: "پاسخ به سؤال‌ها",
    text: "هر جا در دوره یا تمرین گیر کردی، کسی هست که راهنمایی‌ات کند.",
  },
  {
    title: "بازخورد روی پروژه‌ها",
    text: "کدت را بررسی می‌کند و می‌گوید چطور بهترش کنی.",
  },
];

export default function NoMentor({
  requestedAt,
}: {
  requestedAt: string | null;
}) {
  const [requested, setRequested] = useState<string | null>(requestedAt);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestMentor() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/my-mentor/request", {
        method: "POST",
        credentials: "same-origin",
      });
      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || "ثبت درخواست با خطا مواجه شد.");
      }

      setRequested(body.data?.createdAt ?? new Date().toISOString());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ثبت درخواست با خطا مواجه شد.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div dir="rtl" className="space-y-6 pb-8 text-text-primary">
      <section className="relative isolate overflow-hidden rounded-square border border-primary-green/20 bg-card-bg px-6 py-10 text-center sm:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary-green/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 size-56 rounded-full border border-approve/15" />
          <div className="absolute -right-12 -top-10 size-44 rounded-full border border-approve/10" />
        </div>

        <div
          aria-hidden="true"
          className="mx-auto grid size-20 place-items-center rounded-3xl border border-approve/30 bg-approve-bg text-approve"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-10">
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5" />
            <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.7.8 2.8 2.6 3 5.2" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-bold leading-relaxed">
          همراهی یک منتور، یادگیری‌ات را سریع‌تر می‌کند
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-text-muted">
          هنوز منتوری برای شما تعیین نشده است. درخواست بده تا یکی از منتورهای
          آیوهوش همراهت شود.
        </p>

        <div className="mt-8">
          {requested ? (
            <p
              role="status"
              className="mx-auto w-fit rounded-full border border-primary-green/30 bg-approve-bg px-5 py-3 text-sm text-approve"
            >
              درخواست شما در {formatter.format(new Date(requested))} ثبت شد؛
              به‌زودی منتورتان تعیین می‌شود.
            </p>
          ) : (
            <button
              type="button"
              onClick={requestMentor}
              disabled={submitting}
              className="
                min-h-12 rounded-full bg-primary-green px-8 text-sm font-bold text-black
                shadow-lg shadow-primary-green/20 hover:bg-primary-green-hover
                focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve
                disabled:cursor-not-allowed disabled:opacity-60 motion-safe:transition-colors
              "
            >
              {submitting ? "در حال ثبت..." : "درخواست منتور"}
            </button>
          )}
          {error && (
            <p role="alert" className="mt-3 text-xs leading-6 text-danger">
              {error}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="mentor-benefits" className="space-y-3">
        <h2 id="mentor-benefits" className="px-2 text-base font-bold">
          منتور برایت چه کار می‌کند؟
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {benefits.map((benefit, index) => (
            <li key={benefit.title} className="rounded-3xl border border-white/5 bg-card-bg p-5">
              <span className="text-xs font-bold text-approve">
                {(index + 1).toLocaleString("fa-IR")}
              </span>
              <h3 className="mt-2 text-sm font-bold">{benefit.title}</h3>
              <p className="mt-2 text-xs leading-6 text-text-muted">{benefit.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
