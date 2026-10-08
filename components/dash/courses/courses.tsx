"use client";

import CourseList from "@/components/ui/course-list";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import { useCourseList } from "@/features/hooks/use-courselist";
import { useSearchParams } from "next/navigation";

export default function CourseVideoList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q")?.trim() ?? "";
  const category = search ? "" : searchParams.get("category") ?? "";
  const { data: res, isFetching } = useCourseList(category, search);
  const { data: categories } = useCourseCategory();

  const allCategories = categories?.data?.categories;
  const courses = res?.data?.courses ?? [];

  const title = search
    ? `نتایج جست‌وجو برای «${search}»`
    : allCategories?.find((item) => item.slug === category)?.title ??
      "همه دوره‌ها";

  return (
    <>
      <CourseList title={title} courses={courses} />
      {search && res && !isFetching && courses.length === 0 && (
        <p role="status" className="rounded-icon bg-card-bg p-5 text-sm text-text-muted">
          دوره‌ای با این عنوان پیدا نشد.
        </p>
      )}
    </>
  );
}
