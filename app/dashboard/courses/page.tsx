import CourseCategoryFilter from "@/components/dash/courses/category";
import CourseVideoList from "@/components/dash/courses/courses";
import CourseSearch from "@/components/dash/courses/course-search";
import RecommendedCourse from "@/components/dash/courses/recommended-course";
import { Suspense } from "react";

export default function Course() {
  return (
    <div className="flex flex-col gap-8">
      <Suspense fallback={null}>
        <CourseSearch />
      </Suspense>
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
