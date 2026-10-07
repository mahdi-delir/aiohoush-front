"use client";

import CourseList from "@/components/ui/course-list";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import { useCourseList } from "@/features/hooks/use-courselist";
import { useSearchParams } from "next/navigation";

export default function CourseVideoList() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const { data: res } = useCourseList(category);
  const { data: categories } = useCourseCategory();


  const allCategories = categories?.data?.categories;
  
const title =
  allCategories?.find(
    (item) =>
      item.slug === category,
  )?.title ?? 'همه دوره‌ها'
  return <CourseList title={title} courses={res?.data?.courses ?? []} />;
}