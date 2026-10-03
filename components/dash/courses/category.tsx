"use client";

import { HorizentalFilter } from "@/components/ui/horizantal-filter";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import All from "@/assets/puffy-icons/school.svg";
import Web from "@/assets/puffy-icons/web.svg";
import Programming from "@/assets/puffy-icons/code.svg";
import AI from "@/assets/puffy-icons/chatbot.svg";
import Skills from "@/assets/puffy-icons/microphone.svg";
import { Suspense } from "react";

const iconBySlug = {
  web: 'web',
  programming: 'code',
  ai: 'chatbot',
  skills: 'drawing',
} as const

export default function CourseCategoryFilter() {
  const { data: res, isPending, isError } = useCourseCategory();
  const categories =
  (res?.data?.categories ?? [])
    .map((category) => ({
      ...category,

      icon:
        iconBySlug[
          category.slug as keyof
            typeof iconBySlug
        ] ?? 'school',
    }))

  return (
    <Suspense fallback={null}>
      
      <HorizentalFilter
        categories={categories}
        icons={iconBySlug}
        title="دسته‌بندی دوره‌ها"
      />
    </Suspense>
  );
}
