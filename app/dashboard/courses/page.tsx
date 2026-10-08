import CourseCategoryFilter from "@/components/dash/courses/category";
import CourseVideoList from "@/components/dash/courses/courses";
import Input from "@/components/ui/text-input";
import RecommendedCourse from "@/components/dash/courses/recommended-course";
import { Suspense } from "react";

export default function Course() {
  return (
    <div className="flex flex-col gap-8">
      <Input type="search" placeholder="جست‌وجو در دوره‌ها" />
      <Suspense fallback={null}>
        <RecommendedCourse />
      </Suspense>
      <CourseCategoryFilter />
      <Suspense fallback={null}>
        <CourseVideoList />
      </Suspense>
    </div>
  );
}
