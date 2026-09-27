"use client";

import { useId, useState, type FormEvent } from "react";
import type { MentorRating } from "@/types/mentor";
import RatingStars, { StarIcon } from "./rating-stars";

const ratings: MentorRating[] = [1, 2, 3, 4, 5];
const ratingLabels = ["", "ضعیف", "نیازمند بهبود", "متوسط", "خوب", "عالی"];

export default function MentorReviewForm({ mentorName }: { mentorName: string }) {
  const id = useId();
  const [rating, setRating] = useState<MentorRating | null>(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<{ rating: MentorRating; text: string } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === null) return;
    // Local preview only: no request, published review or aggregate mutation.
    setPreview({ rating, text: text.trim() });
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
                  onChange={() => {
                    setRating(value);
                    setPreview(null);
                  }}
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
            onChange={(event) => {
              setText(event.target.value);
              setPreview(null);
            }}
            placeholder="چه چیزی در همراهی با منتورتان برای شما مفید بود؟"
            aria-describedby={`${id}-notice`}
            className="w-full resize-y rounded-2xl border border-white/10 bg-element-bg/40 p-4 text-sm leading-7 placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-approve"
          />
        </div>
        <p id={`${id}-notice`} className="text-xs leading-6 text-text-muted">
          فرم فعلاً در حالت پیش‌نمایش است؛ نظر شما ارسال یا منتشر نمی‌شود.
        </p>
        <button
          type="submit"
          className="w-full cursor-pointer rounded-2xl bg-primary-green px-5 py-3 text-sm font-bold text-black hover:bg-primary-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve motion-safe:transition-colors"
        >
          پیش‌نمایش نظر و امتیاز
        </button>
      </form>

      {preview && (
        <div
          role="status"
          className="mt-5 space-y-3 rounded-2xl border border-dashed border-approve/40 bg-approve-bg/40 p-4"
        >
          <h3 className="text-sm font-bold text-approve">پیش‌نمایش نظر شما — ارسال نشده</h3>
          <RatingStars rating={preview.rating} />
          {preview.text && <p className="text-sm leading-7 whitespace-pre-wrap wrap-anywhere">{preview.text}</p>}
        </div>
      )}
    </section>
  );
}
