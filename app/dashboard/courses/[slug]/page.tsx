import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

import { courseQueryOptions } from "@/features/queries/course-query";
import CourseContent from "@/components/dash/courses/course-content";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

const prepareCourse = cache(async (slug: string) => {
  const queryClient = new QueryClient();
  const options = courseQueryOptions(slug);

  await queryClient.prefetchQuery(options);

  const state = queryClient.getQueryState(options.queryKey);

  if (state?.status === "error") {
    throw state.error;
  }

  const res = queryClient.getQueryData(options.queryKey);

  if (res === undefined) {
    throw new Error("Course query returned no data");
  }

  if (res === null) {
    notFound();
  }

  return {
    course: res.data,
    dehydratedState: dehydrate(queryClient),
  };
});

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { course } = await prepareCourse(slug);

  return {
    title: `${course.course.title} | آیوهوش`,
    description: course.course.short_description,
  };
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { slug } = await params;
  const { dehydratedState } = await prepareCourse(slug);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseContent slug={slug} />
    </HydrationBoundary>
  );
}