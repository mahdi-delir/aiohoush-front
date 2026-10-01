import "server-only";
import { mockMyMentor } from "@/mocks/mentor";
import type { MyMentorData } from "@/types/mentor";
import { ApiResponse } from "@/types/api";

export async function getMyMentor(): Promise<ApiResponse<MyMentorData>> {
  return mockMyMentor;
}
