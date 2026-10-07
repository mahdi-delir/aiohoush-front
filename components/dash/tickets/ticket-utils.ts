import type { MessageDraft, TicketStatus } from "@/types/ticket";
import { voiceFileExtension } from "./voice-recorder";

export const ATTACHMENT_MAX_BYTES = 5 * 1024 * 1024;

export function appendDraft(formData: FormData, draft: MessageDraft) {
  if (draft.text.trim()) formData.append("text", draft.text.trim());

  if (draft.attachment) {
    formData.append("attachment", draft.attachment, draft.attachment.name);
  }

  if (draft.voice) {
    const extension = voiceFileExtension(draft.voice.blob.type);
    formData.append("voice", draft.voice.blob, `voice${extension}`);
    formData.append("voice_duration_ms", String(Math.round(draft.voice.durationMs)));
  }
}

export function isDraftEmpty(draft: MessageDraft) {
  return !draft.text.trim() && !draft.attachment && !draft.voice;
}

const dateTimeFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatTicketDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateTimeFormatter.format(date);
}

export const statusStyles: Record<TicketStatus, string> = {
  waiting: "bg-amber-300/15 text-amber-300",
  answered: "bg-approve-bg text-approve",
  closed: "bg-element-bg text-text-muted",
};

export function ticketFileUrl(messageId: number, kind: "attachment" | "voice") {
  return `/api/tickets/files/${messageId}/${kind}`;
}
