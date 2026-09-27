import { getRankChange } from "@/lib/mentor-leaderboard";

export default function RankMovement({
  rank,
  previousRank,
}: {
  rank: number;
  previousRank: number | null;
}) {
  const { direction, places } = getRankChange(rank, previousRank);

  if (direction === "unavailable") {
    return <span className="text-xs text-text-muted">بدون سابقه</span>;
  }
  if (direction === "same") {
    return <span className="text-xs text-text-muted">— ثابت</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${direction === "up" ? "text-approve" : "text-rose-300"}`}
    >
      <span aria-hidden="true">{direction === "up" ? "↑" : "↓"}</span>
      {places.toLocaleString("fa-IR")}
      <span>{direction === "up" ? "صعود" : "افت"}</span>
    </span>
  );
}
