"use client";

import Code from "@/assets/puffy-icons/code2.svg";
import Google from "@/assets/puffy-icons/google.svg";
import Resume from "@/assets/puffy-icons/resume.svg";
import Calculator from "@/assets/puffy-icons/calculator.svg";
import Glucometer from "@/assets/puffy-icons/glucometer.svg";
import { HorizentalFilter } from "@/components/ui/horizantal-filter";
import { useGetGiftCategory } from "@/features/hooks/use-giftcategory";
import { Suspense } from "react";

export const categoryIcon = {
  start: Code,
  google: Google,
  resume: Resume,
  calc: Calculator,
  diabetes: Glucometer,
};

export default function Category() {
  const { data: res } = useGetGiftCategory();

  return (
    <Suspense fallback={null}>
      <HorizentalFilter
        categories={res?.data?.categories ?? []}
        title="دسته‌بندی هدیه‌ها"
        icons={categoryIcon}
      />
    </Suspense>
  );
}
