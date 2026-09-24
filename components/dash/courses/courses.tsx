"use client";

import CourseList from "@/components/ui/course-list";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import { useCourseList } from "@/features/hooks/use-courselist";
import { useSearchParams } from "next/navigation";

export default function CourseVideoList() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const { data: res, isPending, isError } = useCourseList(category);
  const { data: categories } = useCourseCategory();

  if (!category) {
    return null;
  }

  const allCategories = categories?.data.categories;
  
  const title = allCategories?.find((item) => item.slug === category)?.title ?? "دوره‌ها";

  return <CourseList title={title} list={res?.data.courses ?? []} />;
}