import type { MyMentorData } from "@/types/mentor";
import { summarizeMentorReviews } from "@/lib/mentor-summary";
import MentorAvatar from "./mentor-avatar";
import MentorReviewForm from "./mentor-review-form";
import RatingStars, { StarIcon } from "./rating-stars";
import StatusBar from "@/components/ui/status-bar";

const number = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tehran",
});

export default function MentorOverview({ data }: { data: MyMentorData }) {
  const { mentor, reviews } = data;
  const summary = summarizeMentorReviews(reviews);

  if (!mentor) {
    return (
      <section className="rounded-square border border-white/10 bg-card-bg px-6 py-12 text-center">
        <h1 className="text-xl font-bold">منتور من</h1>
        <p className="mt-4 text-sm leading-7 text-text-muted">
          هنوز منتوری برای شما تعیین نشده است. پس از تعیین منتور، معرفی و دیدگاه‌های او اینجا نمایش داده می‌شود.
        </p>
      </section>
    );
  }

  return (
    <div dir="rtl" className="space-y-6 pb-8 text-text-primary">
      <section
        aria-labelledby="mentor-name"
        className="overflow-hidden rounded-square border border-white/10 bg-card-bg shadow-xl shadow-black/10"
      >
        <div
          aria-hidden="true"
          className="relative h-36 overflow-hidden bg-linear-to-bl from-primary-green/30 via-element-bg to-card-bg sm:h-40"
        >
          <div className="absolute -top-16 -left-8 size-64 rounded-full border border-approve/10" />
          <div className="absolute -top-8 left-0 size-48 rounded-full border border-approve/20" />
          <div className="absolute top-0 left-8 size-32 rounded-full border border-approve/20" />
          <div className="absolute -right-8 -bottom-20 size-48 rounded-full bg-primary-green/10 blur-2xl" />
        </div>
        <div className="relative px-5 pb-6 sm:px-7 sm:pb-7">
          <div className="-mt-14 mb-6 flex flex-wrap items-end justify-between gap-5">
            <MentorAvatar key={mentor.avatarUrl ?? mentor.id} src={mentor.avatarUrl} name={mentor.name} />
            <a
              href="#my-mentor-review"
              className="
                inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-green/30
                bg-approve-bg px-4 py-2 text-sm font-bold text-approve hover:bg-element-bg
                focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve
              "
            >
              <StarIcon filled={false} />
              ثبت تجربهٔ من
            </a>
          </div>
          <p className="mb-2 text-xs text-text-muted">منتور شما</p>
          <h2 id="mentor-name" className="text-2xl font-bold sm:text-3xl">{mentor.name}</h2>
          <p className="mt-2 text-sm leading-7 text-text-muted">{mentor.headline}</p>
          {mentor.specialties.length > 0 && (
            <ul aria-label="تخصص‌های منتور" className="mt-4 flex flex-wrap gap-2">
              {mentor.specialties.map((specialty) => (
                <li key={specialty} className="rounded-full bg-element-bg px-3 py-1.5 text-xs text-approve">
                  {specialty}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="mb-3 text-sm font-bold">از زبان منتور</h3>
            <p className="text-sm leading-8 whitespace-pre-wrap wrap-anywhere text-text-muted">
              {mentor.bio.trim() || "منتور هنوز بیوگرافی خود را تکمیل نکرده است."}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="mentor-ratings"
        className="rounded-square border border-white/10 bg-card-bg p-5 sm:p-6"
      >
        <h2 id="mentor-ratings" className="text-lg font-bold">تجربهٔ همراهی با منتور</h2>
        <p className="mt-2 text-xs leading-6 text-text-muted">بر اساس امتیازهای نمایش‌داده‌شده در این صفحه</p>
        <div className="mt-6 grid items-center gap-6 sm:grid-cols-2">
          <div className="rounded-3xl bg-element-bg/50 px-5 py-6 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-300">
              <StarIcon filled className="size-7" />
              <strong className="text-5xl font-bold text-text-primary">
                {summary.average === null ? "—" : number.format(summary.average)}
              </strong>
              <span className="self-end pb-1 text-sm text-text-muted">از ۵</span>
            </div>
            <p className="mt-4 text-xs text-text-muted">{number.format(summary.total)} امتیاز دانش‌آموزان</p>
          </div>
          <ul aria-label="توزیع امتیازها" className="space-y-3">
            {summary.distribution.map(({ rating, count }) => (
              <li key={rating} className="flex items-center gap-3">
                <span className="flex w-8 shrink-0 items-center gap-1 text-xs text-text-muted">
                  {number.format(rating)}
                  <StarIcon filled className="size-3 text-amber-300" />
                </span>
                <StatusBar percent={(count/summary.total)*100}/>
                <span className="w-5 text-end text-xs text-text-muted">{number.format(count)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="mentor-reviews" className="space-y-4">
        <div className="flex items-center justify-between gap-3 px-2">
          <h2 id="mentor-reviews" className="text-lg font-bold">دیدگاه دانش‌آموزان</h2>
          <span className="rounded-full bg-element-bg px-3 py-1 text-xs text-text-muted">
            {number.format(reviews.length)} دیدگاه
          </span>
        </div>
        {reviews.length === 0 ? (
          <p className="rounded-square bg-card-bg p-6 text-sm leading-7 text-text-muted">
            هنوز دیدگاهی ثبت نشده است. شما می‌توانید اولین تجربه را به اشتراک بگذارید.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id} className="min-w-0 rounded-3xl border border-white/5 bg-card-bg p-5">
                <article className="flex h-full flex-col gap-4">
                  <header className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-element-bg text-sm font-bold text-approve"
                    >
                      {review.authorName.trim().slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold wrap-anywhere">{review.authorName}</h3>
                      <time dateTime={review.createdAt} className="mt-1 block text-xs text-text-muted">
                        {date.format(new Date(review.createdAt))}
                      </time>
                    </div>
                  </header>
                  <RatingStars rating={review.rating} />
                  <p className="text-sm leading-7 whitespace-pre-wrap wrap-anywhere text-text-muted">{review.text}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div id="my-mentor-review" className="scroll-mt-24">
        <MentorReviewForm key={mentor.id} mentorName={mentor.name} />
      </div>
    </div>
  );
}
