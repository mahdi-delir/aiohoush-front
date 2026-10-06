import type { Metadata } from "next";
import ProjectGallery from "@/components/dash/projects/project-gallery";

export const metadata: Metadata = {
  title: "پروژه‌ها | آیوهوش",
  description: "پروژه‌های آیوهوش و دانشجویان؛ توضیحات و تصاویر هر پروژه.",
  robots: { index: false, follow: false },
};

export default function ProjectsPage() {
  return <ProjectGallery />;
}
