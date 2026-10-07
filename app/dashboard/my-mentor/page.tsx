import type { Metadata } from "next";
import MentorOverview from "@/components/dash/mentor/mentor-overview";
import { getMyMentor } from "@/features/api/get-my-mentor";

export const metadata: Metadata = {
  title: "منتور من | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function MyMentorPage() {
  const [result] = await Promise.allSettled([getMyMentor()]);
  const response = result.status === "fulfilled" ? result.value : null;

  if (!response?.data) {
    return (
      <div className="px-2 pt-3 pb-10">
        <h1 className="sr-only">منتور من</h1>
        <p
          role="status"
          className="rounded-icon bg-card-bg p-5 text-sm leading-7 text-text-muted"
        >
          {response?.message ||
            "دریافت اطلاعات منتور ممکن نشد؛ لطفاً صفحه را دوباره بارگذاری کنید."}
        </p>
      </div>
    );
  }

  return <MentorOverview data={response.data} />;
}