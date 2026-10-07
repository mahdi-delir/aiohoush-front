"use client";

import { Suspense } from "react";

import { HorizentalFilter } from "@/components/ui/horizantal-filter";
import { useCourseCategory } from "@/features/hooks/use-coursecategory";
import type { CategoryIcon } from "@/types/category";

import Book from "@/assets/puffy-icons/book.svg";
import Calculator from "@/assets/puffy-icons/calculator.svg";
import ChatBot from "@/assets/puffy-icons/chatbot.svg";
import Code from "@/assets/puffy-icons/code.svg";
import Drawing from "@/assets/puffy-icons/drawing.svg";
import Google from "@/assets/puffy-icons/google.svg";
import Microphone from "@/assets/puffy-icons/microphone.svg";
import Resume from "@/assets/puffy-icons/resume.svg";
import School from "@/assets/puffy-icons/school.svg";
import Training from "@/assets/puffy-icons/training.svg";
import Web from "@/assets/puffy-icons/web.svg";

const iconSources = {
  school: School,
  web: Web,
  code: Code,
  chatbot: ChatBot,
  drawing: Drawing,
  microphone: Microphone,
  book: Book,
  calculator: Calculator,
  google: Google,
  resume: Resume,
  training: Training,
} satisfies Partial<Record<CategoryIcon, unknown>>;

const iconBySlug: Record<string, CategoryIcon> = {
  web: "web",
  programming: "code",
  ai: "chatbot",
  skills: "drawing",
};

function resolveIcon(icon: string | undefined, slug: string): CategoryIcon {
  if (icon && icon in iconSources) return icon as CategoryIcon;
  return iconBySlug[slug] ?? "school";
}

export default function CourseCategoryFilter() {
  const { data: res } = useCourseCategory();

  const categories = (res?.data?.categories ?? []).map((category) => ({
    ...category,
    icon: resolveIcon(category.icon, category.slug),
  }));

  return (
    <Suspense fallback={null}>
      <HorizentalFilter
        categories={categories}
        icons={iconSources}
        title="دسته‌بندی دوره‌ها"
      />
    </Suspense>
  );
}
