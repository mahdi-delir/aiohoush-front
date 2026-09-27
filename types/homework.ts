export type HomeworkStatus = "unreviewed" | "in_review" | "reviewed";

export interface HomeworkAttachment {
  id: string;
  name: string;
  kind: "file" | "video" | "audio";
  url: string | null;
  delivery?: "file" | "hls";
}

export interface HomeworkSubmission {
  id: string;
  courseId: number;
  lesson: {
    id: number;
    order: number;
    title: string;
  };
  submittedAt: string;
  reviewedAt: string | null;
  status: HomeworkStatus;
  files: HomeworkAttachment[];
  feedback: {
    teacherName: string;
    text: string | null;
    attachments: HomeworkAttachment[];
  } | null;
}
