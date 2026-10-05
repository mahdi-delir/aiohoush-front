export type TicketDepartment = "mentor" | "teacher" | "finance" | "management";

export type TicketStatus = "waiting" | "answered" | "closed";

export interface TicketSummary {
  id: number;
  subject: string;
  department: TicketDepartment;
  departmentLabel: string;
  /** نام منتور/استاد یا نام بخش */
  recipient: string;
  courseTitle: string | null;
  status: TicketStatus;
  statusLabel: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface TicketMessage {
  id: number;
  isMine: boolean;
  authorName: string;
  text: string;
  attachment: { name: string; url: string } | null;
  voice: { url: string; durationMs: number | null } | null;
  createdAt: string;
}

export interface TicketDetail extends TicketSummary {
  messages: TicketMessage[];
}

export interface TicketOptions {
  mentor: { id: number; name: string } | null;
  courses: { id: number; title: string; teacherName: string }[];
}

export interface MessageDraft {
  text: string;
  attachment: File | null;
  voice: { blob: Blob; durationMs: number } | null;
}
