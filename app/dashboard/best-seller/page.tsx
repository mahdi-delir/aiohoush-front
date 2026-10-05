import type { Metadata } from "next";
import MentorLeaderboard from "@/components/dash/best-mentors/mentor-leaderboard";
import { getMentorLeaderboard } from "@/features/api/get-mentor-leaderboard";

export const metadata: Metadata = {
  title: "بهترین منتورها | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function BestMentorsPage() {
  const [result] = await Promise.allSettled([getMentorLeaderboard()]);

  const data =
    result.status === "fulfilled" && result.value?.success
      ? result.value.data
      : null;

  if (!data) {
    return (
      <p role="status" className="rounded-square bg-card-bg p-6 text-sm leading-7 text-text-muted">
        دریافت رتبه‌بندی منتورها ممکن نشد؛ لطفاً صفحه را دوباره بارگذاری کنید.
      </p>
    );
  }

  return <MentorLeaderboard data={data} />;
}
