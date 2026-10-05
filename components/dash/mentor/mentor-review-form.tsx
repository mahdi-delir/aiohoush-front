"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { MentorRating, MentorReviews } from "@/types/mentor";
import RatingStars, { StarIcon } from "./rating-stars";

const ratings: MentorRating[] = [1, 2, 3, 4, 5];
const ratingLabels = ["", "ضعیف", "نیازمند بهبود", "متوسط", "خوب", "عالی"];

export default function MentorReviewForm({
  mentorName,
  myReview,
}: {
  mentorName: string;
  myReview: MentorReviews | null;
}) {
  const id = useId();
  const router = useRouter();
  const [rating, setRating] = useState<MentorRating | null>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === null || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/my-mentor/reviews", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text: text.trim() }),
      });
      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success) {
        throw new Error(body?.message || "ثبت نظر با خطا مواجه شد.");
      }

      // صفحه از سرور دوباره خوانده می‌شود تا نظر و میانگین به‌روز شوند.
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ثبت نظر با خطا مواجه شد.");
      setSubmitting(false);
    }
  }

  if (myReview) {
    return (
      <section className="rounded-square border border-primary-green/20 bg-card-bg p-5 sm:p-6">
        <h2 className="text-lg font-bold">نظر شما دربارهٔ {mentorName}</h2>
        <div className="mt-4 space-y-3 rounded-2xl bg-approve-bg/40 p-4">
          <RatingStars rating={myReview.rating} />
          {myReview.text && (
            <p className="text-sm leading-7 whitespace-pre-wrap wrap-anywhere">{myReview.text}</p>
          )}
        </div>
        <p className="mt-3 text-xs leading-6 text-text-muted">
          از اینکه تجربه‌تان را به اشتراک گذاشتید متشکریم.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className="rounded-square border border-primary-green/20 bg-card-bg p-5 sm:p-6"
    >
      <div className="mb-5">
        <h2 id={`${id}-heading`} className="text-lg font-bold">نظر شما دربارهٔ منتور</h2>
        <p className="mt-2 text-sm leading-7 text-text-muted">
          تجربهٔ همراهی با {mentorName} را با دیگر دانش‌آموزان به اشتراک بگذارید.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset className="rounded-2xl bg-element-bg/50 p-4">
          <legend className="px-2 text-sm text-text-muted">امتیاز شما</legend>
          <div className="flex flex-wrap items-center justify-center gap-1">
            {ratings.map((value) => (
              <label key={value} className="relative flex size-11 cursor-pointer items-center justify-center">
                <input
                  type="radio"
                  name={`${id}-rating`}
                  value={value}
                  checked={rating === value}
                  required
                  onChange={() => setRating(value)}
                  className="peer sr-only"
                />
                <span className="sr-only">{value.toLocaleString("fa-IR")} از ۵؛ {ratingLabels[value]}</span>
                <span
                  className={`rounded-lg p-1.5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-approve ${rating !== null && value <= rating ? "text-amber-300" : "text-text-muted"}`}
                >
                  <StarIcon filled={rating !== null && value <= rating} className="size-7" />
                </span>
              </label>
            ))}
          </div>
          <p role="status" className="mt-2 text-center text-xs text-text-muted">
            {rating === null ? "از ۱ تا ۵ امتیاز بدهید" : `${rating.toLocaleString("fa-IR")} از ۵ · ${ratingLabels[rating]}`}
          </p>
        </fieldset>

        <div>
          <label htmlFor={`${id}-text`} className="mb-2 block text-sm">
            دیدگاه شما <span className="text-xs text-text-muted">(اختیاری)</span>
          </label>
          <textarea
            id={`${id}-text`}
            rows={4}
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={1000}
            disabled={submitting}
            placeholder="چه چیزی در همراهی با منتورتان برای شما مفید بود؟"
            aria-describedby={`${id}-notice`}
            className="w-full resize-y rounded-2xl border border-white/10 bg-element-bg/40 p-4 text-sm leading-7 placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-approve"
          />
        </div>
        <p id={`${id}-notice`} className="text-xs leading-6 text-text-muted">
          نظر شما با نام شما برای همه نمایش داده می‌شود و فقط یک بار قابل ثبت است.
        </p>
        {error && (
          <p role="alert" className="text-xs leading-6 text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={rating === null || submitting}
          className="w-full cursor-pointer rounded-2xl bg-primary-green px-5 py-3 text-sm font-bold text-black hover:bg-primary-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve disabled:cursor-not-allowed disabled:opacity-50 motion-safe:transition-colors"
        >
          {submitting ? "در حال ثبت..." : "ثبت نظر و امتیاز"}
        </button>
      </form>

    </section>
  );
}
