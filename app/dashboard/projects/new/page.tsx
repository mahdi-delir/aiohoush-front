import type { Metadata } from "next";
import { NewProjectForm } from "@/components/dash/projects/project-form";

export const metadata: Metadata = {
  title: "ثبت پروژه | آیوهوش",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return <NewProjectForm />;
}
