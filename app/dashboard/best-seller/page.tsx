import type { Metadata } from "next";
import MentorLeaderboard from "@/components/dash/best-mentors/mentor-leaderboard";
import { getMentorLeaderboard } from "@/features/api/get-mentor-leaderboard";

export const metadata: Metadata = {
  title: "بهترین منتورها | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function BestMentorsPage() {
  const res = await getMentorLeaderboard();
  return <MentorLeaderboard data={res.data} />;
}
