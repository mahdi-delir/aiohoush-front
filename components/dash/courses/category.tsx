"use client";

import { HorizentalFilter } from "@/components/ui/horizantal-filter";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import All from "@/assets/puffy-icons/school.svg";
import Web from "@/assets/puffy-icons/web.svg";
import Programming from "@/assets/puffy-icons/code.svg";
import AI from "@/assets/puffy-icons/chatbot.svg";
import Skills from "@/assets/puffy-icons/microphone.svg";
import { Suspense } from "react";

export const categoryIcon = {
  school: All,
  web: Web,
  code: Programming,
  chatbot: AI,
  drawing: Skills,
};

export default function CourseCategoryFilter() {
  const { data: res, isPending, isError } = useCourseCategory();

  return (
    <Suspense fallback={null}>
      <HorizentalFilter
        categories={res?.data?.categories ?? []}
        icons={categoryIcon}
        title="دسته‌بندی دوره‌ها"
      />
    </Suspense>
  );
}
