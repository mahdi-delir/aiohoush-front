"use client"

import CourseList from "@/components/ui/course-list";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import { useCourseList } from "@/features/hooks/use-courselist";
import { useSearchParams } from "next/navigation";

export default function CourseVideoList() {
  const searchParams = useSearchParams();

  const category = searchParams.get("category");

  if (!category) {
    return null;
  }
  const { data: res, isPending, isError } = useCourseList(category);

  const slug = res?.data.slug;

  const { data: cats } = useCourseCategory();

  const cat = cats?.data.categories;

  const title = cat?.find((item) => item.slug === slug)?.title ?? "دوره‌ها";

  return <CourseList title={title} list={res?.data.courses ?? []} />;
}
