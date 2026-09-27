import type { Metadata } from "next";
import ProjectGallery from "@/components/dash/projects/project-gallery";
import { getPublicProjects } from "@/features/api/get-public-projects";

export const metadata: Metadata = {
  title: "پروژه‌ها | آیوهوش",
  description: "پروژه‌های آیوهوش و دانشجویان؛ معرفی سازندگان و دسترسی به فایل‌ها و مخزن پروژه‌ها.",
};

export default async function ProjectsPage() {
  const data = await getPublicProjects();
  return <ProjectGallery data={data.data} />;
}
