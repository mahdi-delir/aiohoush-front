import type { MeResponse } from "@/types/auth";
import { mockMe } from "@/mocks/auth";
import { ApiResponse } from "@/types/api";

export async function getMe(): Promise<ApiResponse<MeResponse>> {
  return mockMe;
}