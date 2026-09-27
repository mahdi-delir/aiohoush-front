import type { RankedMentor } from "@/types/mentor-leaderboard";

export function getRankChange(rank: number, previousRank: number | null) {
  if (previousRank === null) return { direction: "unavailable", places: 0 } as const;
  const difference = previousRank - rank;
  return {
    direction: difference > 0 ? "up" : difference < 0 ? "down" : "same",
    places: Math.abs(difference),
  } as const;
}

export function getTopTenMentors(mentors: RankedMentor[]) {
  return [...mentors].sort((a, b) => a.rank - b.rank).slice(0, 10);
}

export function formatMentorRating(rating: number | null) {
  return rating === null
    ? "—"
    : rating.toLocaleString("fa-IR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}
