"use client";

import Code from "@/assets/puffy-icons/code2.svg";
import Google from "@/assets/puffy-icons/google.svg";
import Resume from "@/assets/puffy-icons/resume.svg";
import Calculator from "@/assets/puffy-icons/calculator.svg";
import Glucometer from "@/assets/puffy-icons/glucometer.svg";
import { HorizentalFilter } from "@/components/ui/horizantal-filter";
import { useGetGiftCategory } from "@/features/hooks/use-giftcategory";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryItem } from "@/types/category";

export const categoryIcon = {
  start: Code,
  google: Google,
  resume: Resume,
  calc: Calculator,
  diabetes: Glucometer,
};

export default function GiftCategory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: res } = useGetGiftCategory();

  function handleCategorySelect(category: CategoryItem) {
    const params = new URLSearchParams(searchParams);
    params.set("category", category.slug);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <HorizentalFilter
      categories={res?.data?.categories ?? []}
      title="دسته‌بندی هدیه‌ها"
      icons={categoryIcon}
      onSelect={handleCategorySelect}
      selectedFilter={searchParams.get('category') ?? undefined}
    />
  );
}
