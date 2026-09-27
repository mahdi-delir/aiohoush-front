"use client";

import { useId, useRef } from "react";
import type { RankedMentor } from "@/types/mentor-leaderboard";
import { formatMentorRating } from "@/lib/mentor-leaderboard";
import RankedAvatar from "./ranked-avatar";

export default function MentorProfileDialog({
  mentor,
  compact = false,
}: {
  mentor: RankedMentor;
  compact?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`معرفی ${mentor.name}`}
        onClick={() => dialogRef.current?.showModal()}
        className={
          compact
            ? "min-h-11 cursor-pointer rounded-xl px-2 text-xs text-text-muted hover:bg-element-bg hover:text-approve focus-visible:outline-2 focus-visible:outline-approve"
            : "min-h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-white/5 px-2 text-xs text-text-primary hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-approve"
        }
      >
        {compact ? "معرفی ←" : "شناخت منتور"}
      </button>
      <dialog
        ref={dialogRef}
        dir="rtl"
        aria-labelledby={headingId}
        className="fixed inset-0 m-auto max-h-10/12 w-11/12 max-w-md overflow-y-auto rounded-square border border-white/10 bg-card-bg p-6 text-start text-text-primary shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="mb-7 flex items-center justify-between gap-3">
          <span className="rounded-full bg-approve-bg px-3 py-1.5 text-xs text-approve">
            رتبهٔ {mentor.rank.toLocaleString("fa-IR")}
          </span>
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            className="min-h-11 cursor-pointer rounded-xl px-3 text-sm text-text-muted hover:bg-element-bg focus-visible:outline-2 focus-visible:outline-approve"
          >
            بستن ×
          </button>
        </div>
        <RankedAvatar
          key={mentor.avatarUrl ?? mentor.id}
          src={mentor.avatarUrl}
          name={mentor.name}
          size="large"
        />
        <h2 id={headingId} className="mt-6 text-2xl font-bold">
          {mentor.name}
        </h2>
        <p className="mt-2 text-sm text-approve">{mentor.specialty}</p>
        <p className="mt-5 text-sm leading-8 whitespace-pre-wrap wrap-anywhere text-text-muted">
          {mentor.bio.trim() || "بیوگرافی این منتور هنوز تکمیل نشده است."}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
          <div>
            <dt className="text-xs text-text-muted">امتیاز دانش‌آموزان</dt>
            <dd className="mt-2 font-bold text-amber-300">
              {formatMentorRating(mentor.rating)} از ۵
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">تعداد امتیازها</dt>
            <dd className="mt-2 font-bold">
              {mentor.reviewCount.toLocaleString("fa-IR")}
            </dd>
          </div>
        </dl>
      </dialog>
    </>
  );
}
