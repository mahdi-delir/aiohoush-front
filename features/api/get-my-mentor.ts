import "server-only";

import { fetchDjango } from "@/lib/django";
import type { ApiResponse } from "@/types/api";
import type { MyMentorData } from "@/types/mentor";

export async function getMyMentor(): Promise<ApiResponse<MyMentorData>> {
  const response = await fetchDjango("/auth/my-mentor/", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("دریافت اطلاعات منتور با خطا مواجه شد.");
  }

  return (await response.json()) as ApiResponse<MyMentorData>;
}
