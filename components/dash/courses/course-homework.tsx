"use client";

import { useId, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMyHomework } from "@/features/api/get-my-homework";
import type {
  SessionHomeworkStatus,
  SessionHomeworkSubmission,
} from "@/types/session-homework";

const statuses: Record<
  SessionHomeworkStatus,
  {
    label: string;
    classes: string;
  }
> = {
  submitted: {
    label: "در انتظار بررسی",
    classes: "bg-amber-400/10 text-amber-300",
  },
  reviewed: {
    label: "بررسی شده",
    classes: "bg-approve-bg text-approve",
  },
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "تاریخ نامعتبر";
  }

  return new Intl.DateTimeFormat(
    "fa-IR-u-ca-persian",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function SubmissionCard({
  item,
}: {
  item: SessionHomeworkSubmission;
}) {
  const attachmentUrl = item.attachment
    ? `/api/homework/${item.id}/attachment`
    : null;

  const status = statuses[item.status];

  return (
    <article className="space-y-4 rounded-square bg-card-bg p-5">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-text-muted">
            جلسه شماره {item.session}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            ارسال شده در {formatDate(item.submitted_at)}
          </p>
        </div>

        <span
          className={`rounded-icon px-3 py-2 text-xs ${status.classes}`}
        >
          {status.label}
        </span>
      </header>

      {item.answer && (
        <section className="space-y-2">
          <h3 className="text-sm font-bold">
            پاسخ شما
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-7">
            {item.answer}
          </p>
        </section>
      )}

      {attachmentUrl && (
        <a
          href={attachmentUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-approve underline"
        >
          مشاهده فایل تمرین
        </a>
      )}

      {item.feedback && (
        <section className="border-t border-white/10 pt-4">
          <h3 className="mb-2 text-sm font-bold">
            بازخورد استاد
          </h3>

          <p className="whitespace-pre-wrap text-sm leading-7">
            {item.feedback}
          </p>

          {item.reviewed_at && (
            <p className="mt-2 text-xs text-text-muted">
              بررسی شده در {formatDate(item.reviewed_at)}
            </p>
          )}
        </section>
      )}
    </article>
  );
}

export default function CourseHomework({
  courseId,
}: {
  courseId: number;
}) {
  const filterId = useId();

  const [filter, setFilter] = useState<
    SessionHomeworkStatus | "all"
  >("all");

  const {
    data,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my-homework", courseId],
    queryFn: () => getMyHomework(courseId),
    enabled: courseId > 0,
    staleTime: 0,
    retry: false,
  });

  if (isPending) {
    return (
      <p role="status" className="text-sm text-text-muted">
        در حال دریافت تمرین‌ها…
      </p>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-3 rounded-square bg-card-bg p-5">
        <p className="text-sm">
          دریافت تمرین‌ها انجام نشد.
        </p>

        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="text-sm text-approve underline disabled:opacity-50"
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  const submissions = data.data.filter(
    (item) =>
      filter === "all" || item.status === filter,
  );

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3 text-sm">
        <label htmlFor={filterId}>
          وضعیت تمرین
        </label>

        <select
          id={filterId}
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value as
                | SessionHomeworkStatus
                | "all",
            )
          }
          className="rounded-icon bg-element-bg p-2"
        >
          <option value="all">همه</option>
          <option value="submitted">
            در انتظار بررسی
          </option>
          <option value="reviewed">
            بررسی شده
          </option>
        </select>
      </div>

      {submissions.length > 0 ? (
        <ul className="space-y-4">
          {submissions.map((item) => (
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
          هنوز تمرینی برای این دوره ارسال نکرده‌اید.
        </p>
      )}
    </section>
  );
}