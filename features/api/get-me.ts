import type { MeResponse } from "@/types/auth";
import { mockMe } from "@/mocks/auth";

export async function getMe(): Promise<MeResponse> {
  return mockMe;
}