"use client";

import { useQuery } from "@tanstack/react-query";
import { courseQueryOptions } from "@/features/queries/course-query";

export default function useCourse(slug: string) {
  return useQuery(courseQueryOptions(slug));
}