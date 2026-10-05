import type { MentorLeaderboard as LeaderboardData } from "@/types/mentor-leaderboard";
import { formatMentorRating, getTopTenMentors } from "@/lib/mentor-leaderboard";
import MentorPodium from "./mentor-podium";
import MentorProfileDialog from "./mentor-profile-dialog";
import RankedAvatar from "./ranked-avatar";
import RatingLine from "./rating-line";
import RankMovement from "./rank-movement";
import { RatingIcon, TrophyIcon } from "./leaderboard-icons";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tehran",
});

export default function MentorLeaderboard({ data }: { data: LeaderboardData }) {
  const mentors = getTopTenMentors(data.mentors);
  const podium = mentors.filter((mentor) => mentor.rank <= 3);
  const remaining = mentors.filter((mentor) => mentor.rank > 3);
  const showMovement = data.comparisonLabel !== null;

  return (
    <div dir="rtl" className="space-y-8 pb-8 text-text-primary">
      <header
        className="
          relative isolate overflow-hidden rounded-square border border-primary-green/20 bg-card-bg
          px-5 pt-7 pb-6 sm:px-7
        "
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 -left-16 size-80 rounded-full bg-primary-green/10 blur-3xl" />
          <div className="absolute -top-14 -left-14 size-64 rounded-full border border-approve/10" />
          <div className="absolute -top-6 -left-6 size-48 rounded-full border border-approve/10" />
          <span className="absolute top-5 left-4 text-8xl leading-none font-black text-white/5 sm:left-8">۱۰</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-approve">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-approve" />
            افتخار آیوهوش
          </p>
          <span
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-text-muted"
          >
            {data.periodLabel}
          </span>
        </div>
        <div className="mt-7 flex items-start gap-4">
          <span
            className="grid size-14 shrink-0 place-items-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300"
          >
            <TrophyIcon className="size-8" />
          </span>
          <div>
            <h1 className="text-2xl leading-tight font-bold sm:text-3xl">بهترین منتورها</h1>
            <p className="mt-3 text-sm leading-7 text-text-muted">اثر بزرگ، از همراهی خوب شروع می‌شود.</p>
          </div>
        </div>
        <p className="mt-5 max-w-md text-sm leading-8 text-text-muted">
          اینجا جای منتورهایی است که مسیر یادگیری را روشن‌تر می‌کنند؛
          همراهانی برای قدم‌های بزرگ بعدی تو.
        </p>
        <div
          className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"
        >
          <span className="text-xs text-text-muted">
            به‌روزرسانی: <time dateTime={data.updatedAt}>{dateFormatter.format(new Date(data.updatedAt))}</time>
          </span>
          <a
            href="#ranking-policy"
            className="
              inline-flex min-h-11 items-center rounded-lg text-xs text-approve hover:underline
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve
            "
          >
            دربارهٔ رتبه‌بندی ←
          </a>
        </div>
      </header>

  

      {mentors.length === 0 ? (
        <section className="rounded-square border border-white/10 bg-card-bg px-6 py-12 text-center">
          <TrophyIcon className="mx-auto mb-4 size-10 text-text-muted" />
          <h2 className="text-lg font-bold">سکوی افتخار در انتظار منتورهاست</h2>
          <p className="mt-3 text-sm leading-7 text-text-muted">رتبه‌بندی این دوره هنوز منتشر نشده است.</p>
        </section>
      ) : (
        <>
          {podium.length > 0 && <MentorPodium mentors={podium} showMovement={showMovement} />}
          {showMovement && (
            <p className="px-2 text-center text-xs leading-6 text-text-muted">
              تغییر جایگاه‌ها {data.comparisonLabel}
            </p>
          )}
          {remaining.length > 0 && (
            <section aria-labelledby="ranking-list-heading" className="space-y-4">
              <div className="flex items-center justify-between gap-3 px-2">
                <h2 id="ranking-list-heading" className="text-lg font-bold">در جمع بهترین‌ها</h2>
                <span className="text-xs text-text-muted">رقابت برای اثرگذاری</span>
              </div>
              <ol start={remaining[0].rank} aria-label="ادامهٔ رتبه‌بندی منتورها" className="space-y-3">
                {remaining.map((mentor) => (
                  <li key={mentor.id} value={mentor.rank}>
                    <article
                      className="
                        group rounded-3xl border border-white/5 bg-card-bg p-4 hover:border-primary-green/30
                        motion-safe:transition-colors sm:p-5
                      "
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <span
                          className="w-6 shrink-0 text-center text-lg font-bold text-text-muted group-hover:text-approve sm:w-8"
                        >
                          <span className="sr-only">رتبهٔ </span>
                          {mentor.rank.toLocaleString("fa-IR")}
                        </span>
                        <RankedAvatar key={mentor.avatarUrl ?? mentor.id} src={mentor.avatarUrl} name={mentor.name} />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold wrap-anywhere sm:text-base">{mentor.name}</h3>
                          {mentor.specialty && (
                            <p className="mt-1 text-xs leading-5 text-text-muted">{mentor.specialty}</p>
                          )}
                          <RatingLine mentor={mentor} />
                        </div>
                        <div className="shrink-0 text-end">
                          <span className="block text-base font-bold tabular-nums text-approve sm:text-lg">
                            {mentor.points.toLocaleString("fa-IR")}
                          </span>
                          <span className="mt-0.5 block text-xs text-text-muted">امتیاز</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/5 pt-1">
                        {showMovement ? (
                          <RankMovement rank={mentor.rank} previousRank={mentor.previousRank} />
                        ) : <span className="text-xs text-text-muted">منتور آیوهوش</span>}
                        <MentorProfileDialog mentor={mentor} compact />
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}

      <section
        id="ranking-policy"
        aria-labelledby="ranking-policy-heading"
        className="
          scroll-mt-24 rounded-3xl border border-primary-green/15 bg-linear-to-bl from-approve-bg/70
          to-card-bg p-5 sm:p-6
        "
      >
        <h2 id="ranking-policy-heading" className="text-sm font-bold text-approve">پشت هر رتبه، یک مسیر رشد است</h2>
        <p className="mt-3 text-sm leading-8 text-text-muted">{data.rankingDescription}</p>
        <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-7 text-text-muted">
          عدد کنار ستاره، امتیاز دانش‌آموزان از ۵ است. پیکان‌ها تغییر جایگاه را نشان می‌دهند؛
          «بدون سابقه» یعنی اطلاعات دورهٔ قبل برای مقایسه موجود نیست.
        </p>
      </section>
    </div>
  );
}
