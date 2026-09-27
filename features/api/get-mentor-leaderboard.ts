import "server-only";
import { mockMentorLeaderboard } from "@/mocks/mentor-leaderboard";
import type { MentorLeaderboard } from "@/types/mentor-leaderboard";
import { ApiResponse } from "@/types/global";

export async function getMentorLeaderboard(): Promise<ApiResponse<MentorLeaderboard>> {
  // Replace with a validated response when the Django contract is defined.
  // Rank and previousRank must come from the same server-side ranking policy.
  return mockMentorLeaderboard;
}
