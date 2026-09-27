import { MentorReviews } from "@/types/mentor";

export function summarizeMentorReviews(reviews: MentorReviews[]) {
  const total = reviews.length;
  return {
    total,
    average: total === 0 ? null : reviews.reduce((sum, review) => sum + review.rating, 0) / total,
    distribution: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((review) => review.rating === rating).length,
    })),
  };
}
