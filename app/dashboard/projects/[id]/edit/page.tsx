import type { Metadata } from "next";
import { EditProjectForm } from "@/components/dash/projects/project-form";

export const metadata: Metadata = {
  title: "ویرایش پروژه | آیوهوش",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProjectForm projectId={id} />;
}
