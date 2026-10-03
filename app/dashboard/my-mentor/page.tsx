import type { Metadata } from "next";
import MentorOverview from "@/components/dash/mentor/mentor-overview";
import { getMyMentor } from "@/features/api/get-my-mentor";

export const metadata: Metadata = {
  title: "منتور من | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function MyMentorPage() {
  const response = await getMyMentor();

  if (!response.data) {
    throw new Error(
      response.message || "دریافت اطلاعات منتور با خطا مواجه شد."
    );
  }

  return <MentorOverview data={response.data} />;
}