"use client";

import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyHomework } from "@/features/api/get-my-homework";
import { formatHomeworkDate } from "@/lib/homework-display";
import type { HomeworkStatus, HomeworkSubmission } from "@/types/homework";
import HomeworkAttachmentView from "./homework-attachment";

const statuses = {
  unreviewed: { label: "بررسی نشده", classes: "bg-white/10 text-text-muted" },
  in_review: {
    label: "در حال بررسی",
    classes: "bg-amber-400/10 text-amber-300",
  },
  reviewed: { label: "بررسی شده", classes: "bg-approve-bg text-approve" },
} satisfies Record<HomeworkStatus, { label: string; classes: string }>;

function SubmissionCard({ item }: { item: HomeworkSubmission }) {
  const status = statuses[item.status];
  return (
    <article className="rounded-square bg-card-bg p-4 space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs text-text-muted">
            جلسهٔ {item.lesson.order.toLocaleString("fa-IR")}
          </p>
          <h3 className="font-bold">{item.lesson.title}</h3>
        </div>
        <span className={`rounded-icon px-4 py-2 text-xs ${status.classes}`}>
          {status.label}
        </span>
      </header>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-text-muted">تاریخ ارسال</dt>
          <dd>
            <time dateTime={item.submittedAt}>
              {formatHomeworkDate(item.submittedAt)}
            </time>
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">تاریخ بررسی</dt>
          <dd>
            {item.reviewedAt ? (
              <time dateTime={item.reviewedAt}>
                {formatHomeworkDate(item.reviewedAt)}
              </time>
            ) : (
              "هنوز بررسی نهایی نشده"
            )}
          </dd>
        </div>
      </dl>
      <section className="space-y-2" aria-label="فایل‌های ارسالی شما">
        <h4 className="font-semibold text-sm">فایل‌های ارسالی شما</h4>
        {item.files.length ? (
          item.files.map((file) => (
            <HomeworkAttachmentView key={file.id} item={file} />
          ))
        ) : (
          <p className="text-sm text-text-muted">
            فایلی برای این ارسال ثبت نشده است.
          </p>
        )}
      </section>
      <section
        className="space-y-3 border-t border-white/10 pt-4"
        aria-label="پاسخ استاد"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-semibold text-sm">پاسخ استاد</h4>
          {item.feedback && (
            <span className="text-xs text-text-muted">
              {item.feedback.teacherName}
            </span>
          )}
        </div>
        {item.feedback ? (
          <>
            {item.feedback.text && (
              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7">
                {item.feedback.text}
              </p>
            )}
            {item.feedback.attachments.map((file) => (
              <HomeworkAttachmentView key={file.id} item={file} />
            ))}
            {!item.feedback.text && item.feedback.attachments.length === 0 && (
              <p className="text-sm text-text-muted">
                پاسخ متنی یا پیوستی ثبت نشده است.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-text-muted">
            {item.status === "in_review"
              ? "استاد در حال بررسی تمرین شماست؛ هنوز پاسخی ثبت نشده است."
              : item.status === "reviewed"
                ? "تمرین بررسی شده، اما پاسخ متنی یا پیوستی ثبت نشده است."
                : "تمرین شما هنوز بررسی نشده است."}
          </p>
        )}
      </section>
    </article>
  );
}

export default function CourseHomework({ courseId }: { courseId: number }) {
  const filterId = useId();
  const [filter, setFilter] = useState<HomeworkStatus | "all">("all");
  const { data, isPending, isError, refetch, isFetching } = useQuery({
    queryKey: ["my-homework", courseId],
    queryFn: () => getMyHomework(courseId),
    // No persistent cache for the temporary private-data adapter.
    gcTime: 0,
    staleTime: 0,
    retry: false,
  });

  if (isPending)
    return (
      <p role="status" className="text-sm text-text-muted">
        در حال دریافت تمرین‌ها…
      </p>
    );
  if (isError && !data)
    return (
      <div role="alert" className="space-y-3 rounded-square bg-card-bg p-5">
        <p>دریافت تمرین‌ها ممکن نشد.</p>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="text-approve underline disabled:opacity-50"
        >
          تلاش دوباره
        </button>
      </div>
    );
  if (!data) return null;

  const items = [...data.data]
    .filter((item) => filter === "all" || item.status === filter)
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <label htmlFor={filterId}>وضعیت</label>
        <select
          id={filterId}
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as HomeworkStatus | "all")
          }
          className="rounded-icon bg-element-bg p-2 focus-visible:outline-2 focus-visible:outline-primary-green"
        >
          <option value="all" className="rounded-icon bg-background">همه</option>
          {Object.entries(statuses).map(([value, status]) => (
            <option key={value} value={value} className="rounded-icon bg-background">
              {status.label}
            </option>
          ))}
        </select>
      </div>
      {isError && (
        <p role="status" className="text-sm text-danger">
          به‌روزرسانی انجام نشد؛ اطلاعات قبلی نمایش داده می‌شود.
        </p>
      )}
      {items.length ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              <SubmissionCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p
          role="status"
          className="rounded-square bg-card-bg p-6 text-sm text-text-muted"
        >
          {data.data.length
            ? "تمرینی با این وضعیت وجود ندارد."
            : "هنوز تمرینی برای این دوره ارسال نکرده‌اید."}
        </p>
      )}
    </section>
  );
}
