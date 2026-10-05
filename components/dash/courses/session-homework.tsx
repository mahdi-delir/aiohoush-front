"use client";

import { FormEvent, useEffect, useState } from "react";
import { HOMEWORK_ACCEPT } from "@/lib/homework-files";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSessionHomework,
  submitSessionHomework,
} from "@/features/api/session-homework";
import { getHomeworkAttachmentUrl } from "@/lib/homework-display";
import type { SessionHomeworkSubmission } from "@/types/session-homework";

type SessionHomeworkProps = {
  sessionId: number;
};

function HomeworkResult({
  submission,
}: {
  submission: SessionHomeworkSubmission;
}) {
  const attachmentUrl = getHomeworkAttachmentUrl(
    submission.attachment,
  );

  return (
    <div className="space-y-4 rounded-square bg-card-bg p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-bold">تمرین ارسال‌شده</h3>

        <span
          className={`rounded-icon px-3 py-1 text-xs ${
            submission.status === "reviewed"
              ? "bg-approve-bg text-approve"
              : "bg-amber-400/10 text-amber-300"
          }`}
        >
          {submission.status === "reviewed"
            ? "بررسی شده"
            : "در انتظار بررسی"}
        </span>
      </div>

      {submission.answer && (
        <div className="space-y-2">
          <p className="text-sm text-text-muted">پاسخ شما</p>
          <p className="whitespace-pre-wrap text-sm leading-7">
            {submission.answer}
          </p>
        </div>
      )}

      {attachmentUrl && (
        <a
          href={attachmentUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-approve underline"
        >
          مشاهده فایل ارسال‌شده
        </a>
      )}

      {submission.feedback && (
        <div className="border-t border-white/10 pt-4">
          <p className="mb-2 text-sm text-text-muted">
            بازخورد استاد
          </p>
          <p className="whitespace-pre-wrap text-sm leading-7">
            {submission.feedback}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SessionHomework({
  sessionId,
}: SessionHomeworkProps) {
  const queryClient = useQueryClient();

  const [answer, setAnswer] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  const homeworkQuery = useQuery({
    queryKey: ["session-homework", sessionId],
    queryFn: () => getSessionHomework(sessionId),
    enabled: sessionId > 0,
    retry: false,
  });

  const submission =
    homeworkQuery.data?.data ?? null;

  useEffect(() => {
    if (submission?.answer) {
      setAnswer(submission.answer);
    }
  }, [submission?.answer]);

  const submitMutation = useMutation({
    mutationFn: submitSessionHomework,
    onSuccess: async () => {
      setAttachment(null);
      await queryClient.invalidateQueries({
        queryKey: ["session-homework", sessionId],
      });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!answer.trim() && !attachment) {
      setFormError(
        "متن پاسخ یا فایل تمرین را وارد کنید.",
      );
      return;
    }

    submitMutation.mutate({
      sessionId,
      answer,
      attachment,
    });
  }

  if (homeworkQuery.isPending) {
    return (
      <section className="mt-6 rounded-square bg-card-bg p-5">
        <p className="text-sm text-text-muted">
          در حال دریافت وضعیت تمرین…
        </p>
      </section>
    );
  }

  if (homeworkQuery.isError) {
    return (
      <section className="mt-6 rounded-square bg-card-bg p-5">
        <p className="text-sm text-danger">
          دریافت وضعیت تمرین انجام نشد.
        </p>

        <button
          type="button"
          onClick={() => void homeworkQuery.refetch()}
          className="mt-3 text-sm text-approve underline"
        >
          تلاش دوباره
        </button>
      </section>
    );
  }

  if (submission?.status === "reviewed") {
    return (
      <section className="mt-6">
        <HomeworkResult submission={submission} />
      </section>
    );
  }

  return (
    <section className="mt-6 space-y-4 rounded-square bg-card-bg p-5">
      <div>
        <h3 className="font-bold">ارسال تمرین جلسه</h3>
        <p className="mt-1 text-sm text-text-muted">
          پاسخ خود را بنویسید یا فایل تمرین را ارسال کنید.
        </p>
      </div>

      {submission && (
        <div className="rounded-icon bg-element-bg p-3 text-sm">
          تمرین قبلی شما قابل ویرایش است.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label
            htmlFor={`homework-answer-${sessionId}`}
            className="text-sm"
          >
            پاسخ تمرین
          </label>

          <textarea
            id={`homework-answer-${sessionId}`}
            value={answer}
            onChange={(event) =>
              setAnswer(event.target.value)
            }
            rows={6}
            placeholder="پاسخ خود را وارد کنید..."
            className="w-full rounded-icon bg-element-bg p-3 text-sm outline-none focus:ring-2 focus:ring-primary-green"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`homework-file-${sessionId}`}
            className="text-sm"
          >
            فایل تمرین
          </label>

          <input
            id={`homework-file-${sessionId}`}
            type="file"
            accept={HOMEWORK_ACCEPT}
            onChange={(event) =>
              setAttachment(
                event.target.files?.[0] ?? null,
              )
            }
            className="block w-full text-sm text-text-muted file:ml-3 file:rounded-icon file:border-0 file:bg-element-bg file:px-3 file:py-2 file:text-white"
          />

          {attachment && (
            <p className="text-xs text-text-muted">
              فایل انتخاب‌شده: {attachment.name}
            </p>
          )}
        </div>

        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}

        {submitMutation.isError && (
          <p role="alert" className="text-sm text-danger">
            {submitMutation.error instanceof Error
              ? submitMutation.error.message
              : "ارسال تمرین انجام نشد."}
          </p>
        )}

        {submitMutation.isSuccess && (
          <p role="status" className="text-sm text-approve">
            تمرین با موفقیت ارسال شد.
          </p>
        )}

        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="rounded-icon bg-primary-green px-5 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitMutation.isPending
            ? "در حال ارسال..."
            : "ارسال تمرین"}
        </button>
      </form>
    </section>
  );
}