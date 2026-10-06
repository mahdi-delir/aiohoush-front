import type { Metadata } from "next";
import MyProjects from "@/components/dash/projects/my-projects";

export const metadata: Metadata = {
  title: "پروژه‌های من | آیوهوش",
  robots: { index: false, follow: false },
};

export default function MyProjectsPage() {
  return <MyProjects />;
}
