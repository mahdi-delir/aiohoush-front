import type { Metadata } from "next";

import CourseContent from "@/components/dash/courses/course-content";

type CoursePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} | آیوهوش`,
  };
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { slug } = await params;

  return <CourseContent slug={slug} />;
}