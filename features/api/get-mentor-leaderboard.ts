import "server-only";

import { fetchDjango } from "@/lib/django";
import type { ApiResponse } from "@/types/api";
import type { MentorLeaderboard } from "@/types/mentor-leaderboard";

export async function getMentorLeaderboard(): Promise<ApiResponse<MentorLeaderboard> | null> {
  const response = await fetchDjango("/accounting/mentor-leaderboard/", {
    method: "GET",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ApiResponse<MentorLeaderboard>;
}
