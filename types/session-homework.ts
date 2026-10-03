export type SessionHomeworkStatus = "submitted" | "reviewed";

export interface SessionHomeworkSubmission {
  id: number;
  session: number;
  answer: string;
  attachment: string | null;
  status: SessionHomeworkStatus;
  feedback: string;
  submitted_at: string;
  updated_at: string;
  reviewed_at: string | null;
}