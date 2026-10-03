import { apiFetch } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  SessionHomeworkSubmission,
} from "@/types/session-homework";

export async function getSessionHomework(
  sessionId: number,
): Promise<ApiResponse<SessionHomeworkSubmission | null>> {
  return apiFetch<SessionHomeworkSubmission | null>(
    `/api/course-sessions/${sessionId}/homework`,
  );
}

type SubmitSessionHomeworkInput = {
  sessionId: number;
  answer: string;
  attachment: File | null;
};

export async function submitSessionHomework({
  sessionId,
  answer,
  attachment,
}: SubmitSessionHomeworkInput): Promise<
  ApiResponse<SessionHomeworkSubmission>
> {
  const formData = new FormData();

  if (answer.trim()) {
    formData.append("answer", answer.trim());
  }

  if (attachment) {
    formData.append("attachment", attachment);
  }

  return apiFetch<SessionHomeworkSubmission>(
    `/api/course-sessions/${sessionId}/homework`,
    {
      method: "POST",
      body: formData,
    },
  );
}