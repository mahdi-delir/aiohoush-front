import type { RankedMentor } from "@/types/mentor-leaderboard";
import RankedAvatar from "./ranked-avatar";
import RatingLine from "./rating-line";
import MentorProfileDialog from "./mentor-profile-dialog";
import RankMovement from "./rank-movement";
import { TrophyIcon } from "./leaderboard-icons";

const podiumStyles = {
  1: {
    placement: "order-2",
    card: "border-amber-300/40 bg-linear-to-b from-amber-300/15 via-card-bg to-card-bg shadow-xl shadow-amber-500/5",
    badge: "bg-amber-300 text-amber-950",
    label: "طلایی",
    tone: "gold",
  },
  2: {
    placement: "order-1 mt-10 sm:mt-12",
    card: "border-slate-300/20 bg-linear-to-b from-slate-300/10 to-card-bg",
    badge: "bg-slate-300 text-slate-900",
    label: "نقره‌ای",
    tone: "silver",
  },
  3: {
    placement: "order-3 mt-14 sm:mt-16",
    card: "border-orange-300/20 bg-linear-to-b from-orange-300/10 to-card-bg",
    badge: "bg-orange-300 text-orange-950",
    label: "برنزی",
    tone: "bronze",
  },
} as const;

export default function MentorPodium({
  mentors,
  showMovement,
}: {
  mentors: RankedMentor[];
  showMovement: boolean;
}) {
  return (
    <section aria-labelledby="podium-heading" className="space-y-6">
      <div className="flex items-center gap-3 px-1">
        <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        <h2 id="podium-heading" className="text-sm font-bold text-text-muted">سکوی افتخار</h2>
        <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
      </div>
      <ol aria-label="سه منتور نخست" className="grid grid-cols-3 items-start gap-2 sm:gap-4">
        {mentors.map((mentor) => {
          const rank = mentor.rank as 1 | 2 | 3;
          const style = podiumStyles[rank];
          if (!style) return null;

          return (
            <li key={mentor.id} value={mentor.rank} className={`min-w-0 ${style.placement}`}>
              <article
                className={`relative flex flex-col items-center rounded-3xl border px-2 pt-5 pb-3 text-center sm:px-3 ${style.card}`}
              >
                {rank === 1 && <TrophyIcon className="mb-3 size-8 text-amber-300" />}
                <div className="relative mb-5">
                  <RankedAvatar
                    key={mentor.avatarUrl ?? mentor.id}
                    src={mentor.avatarUrl}
                    name={mentor.name}
                    size={rank === 1 ? "large" : "medium"}
                    tone={style.tone}
                  />
                  <span
                    className={`absolute -bottom-3 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full text-xs font-bold ring-4 ring-card-bg ${style.badge}`}
                  >
                    <span className="sr-only">رتبهٔ </span>
                    {rank.toLocaleString("fa-IR")}
                  </span>
                </div>
                <p className="mb-2 text-xs text-text-muted">جایگاه {style.label}</p>
                <h3 className="text-sm leading-6 font-bold wrap-anywhere sm:text-base">{mentor.name}</h3>
                <p className="mt-1 min-h-5 text-xs leading-5 text-text-muted">{mentor.specialty}</p>
                <div className="mt-3 text-lg font-bold tabular-nums text-approve">
                  {mentor.points.toLocaleString("fa-IR")}
                  <span className="ms-1 text-xs font-normal text-text-muted">امتیاز</span>
                </div>
                <RatingLine mentor={mentor} className="justify-center" />
                {showMovement && (
                  <div className="mt-3">
                    <RankMovement rank={mentor.rank} previousRank={mentor.previousRank} />
                  </div>
                )}
                <div className="mt-4 w-full">
                  <MentorProfileDialog mentor={mentor} />
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
