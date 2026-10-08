import "server-only";

import { fetchDjango } from "@/lib/django";
import type { ApiResponse } from "@/types/api";

export interface RecommendedCourse {
  id: number;
  title: string;
  slug: string;
  cover: string | null;
  duration: string | null;
  level: string;
}

export async function getRecommendedCourse(): Promise<RecommendedCourse | null> {
  try {
    const response = await fetchDjango("/course/recommended/", {
      method: "GET",
    });

    if (!response.ok) return null;

    const body = (await response.json()) as ApiResponse<{
      course: RecommendedCourse | null;
    }>;

    return body.success ? body.data?.course ?? null : null;
  } catch {
    return null;
  }
}
