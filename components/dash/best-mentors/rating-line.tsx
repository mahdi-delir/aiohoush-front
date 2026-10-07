import type { RankedMentor } from "@/types/mentor-leaderboard";
import { formatMentorRating } from "@/lib/mentor-leaderboard";
import { RatingIcon } from "./leaderboard-icons";

export default function RatingLine({
  mentor,
  className = "",
}: {
  mentor: RankedMentor;
  className?: string;
}) {
  if (mentor.rating === null) {
    return null;
  }

  return (
    <p
      aria-label={`نظر دانش‌آموزان ${formatMentorRating(mentor.rating)} از ۵ از ${mentor.reviewCount.toLocaleString("fa-IR")} نظر`}
      className={`mt-1 flex items-center gap-1 text-xs text-text-muted ${className}`}
    >
      <RatingIcon />
      {formatMentorRating(mentor.rating)}
      <span>({mentor.reviewCount.toLocaleString("fa-IR")} نظر)</span>
    </p>
  );
}
