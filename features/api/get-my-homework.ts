import { apiFetch } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  SessionHomeworkSubmission,
} from "@/types/session-homework";

export async function getMyHomework(
  courseId: number,
): Promise<
  ApiResponse<SessionHomeworkSubmission[]>
> {
  return apiFetch<SessionHomeworkSubmission[]>(
    `/api/homework/mine?course=${courseId}`,
  );
}