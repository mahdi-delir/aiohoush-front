import type { Metadata } from "next";
import ProjectDetailView from "@/components/dash/projects/project-detail";

export const metadata: Metadata = {
  title: "پروژه | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailView projectId={id} />;
}
