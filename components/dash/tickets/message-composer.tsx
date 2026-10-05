"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import { HOMEWORK_ACCEPT } from "@/lib/homework-files";
import type { MessageDraft } from "@/types/ticket";
import { ATTACHMENT_MAX_BYTES, isDraftEmpty } from "./ticket-utils";
import VoiceRecorder, { formatVoiceDuration } from "./voice-recorder";

const emptyDraft: MessageDraft = { text: "", attachment: null, voice: null };

export default function MessageComposer({
  submitLabel,
  placeholder = "پیام خود را بنویسید…",
  disabled,
  onSubmit,
}: {
  submitLabel: string;
  placeholder?: string;
  disabled?: boolean;
  /** true یعنی ارسال موفق بود و فرم خالی شود */
  onSubmit: (draft: MessageDraft) => Promise<boolean>;
}) {
  const id = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<MessageDraft>(emptyDraft);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);

  // پیش‌نمایش پیام صوتی ضبط‌شده
  useEffect(() => {
    if (!draft.voice) {
      setVoiceUrl(null);
      return;
    }
    const url = URL.createObjectURL(draft.voice.blob);
    setVoiceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [draft.voice]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isDraftEmpty(draft) || sending) return;

    setSending(true);
    setError(null);

    try {
      const ok = await onSubmit(draft);
      if (ok) {
        setDraft(emptyDraft);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ارسال پیام با خطا مواجه شد.");
    } finally {
      setSending(false);
    }
  }

  const busy = disabled || sending;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor={`${id}-text`} className="sr-only">متن پیام</label>
      <textarea
        id={`${id}-text`}
        rows={3}
        maxLength={5000}
        value={draft.text}
        disabled={busy}
        onChange={(event) => setDraft({ ...draft, text: event.target.value })}
        placeholder={placeholder}
        className="w-full resize-y rounded-2xl border border-white/10 bg-element-bg/40 p-4 text-sm leading-7 placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-approve"
      />

      {(draft.attachment || draft.voice) && (
        <ul className="flex flex-wrap gap-2">
          {draft.attachment && (
            <li className="flex items-center gap-2 rounded-full bg-element-bg px-3 py-1.5 text-xs">
              <span className="max-w-48 truncate" dir="ltr">{draft.attachment.name}</span>
              <button
                type="button"
                onClick={() => {
                  setDraft({ ...draft, attachment: null });
                  if (fileRef.current) fileRef.current.value = "";
                }}
                aria-label="حذف فایل"
                className="text-text-muted hover:text-danger"
              >
                ×
              </button>
            </li>
          )}
          {draft.voice && voiceUrl && (
            <li className="flex items-center gap-2 rounded-full bg-element-bg py-1 ps-1 pe-3 text-xs">
              <audio src={voiceUrl} controls className="h-8 max-w-56" />
              <span className="tabular-nums">{formatVoiceDuration(draft.voice.durationMs)}</span>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, voice: null })}
                aria-label="حذف پیام صوتی"
                className="text-text-muted hover:text-danger"
              >
                ×
              </button>
            </li>
          )}
        </ul>
      )}

      {error && <p role="alert" className="text-xs leading-6 text-danger">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            id={`${id}-file`}
            type="file"
            accept={HOMEWORK_ACCEPT}
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              if (file && file.size > ATTACHMENT_MAX_BYTES) {
                setError("حجم فایل نباید بیشتر از ۵ مگابایت باشد.");
                event.target.value = "";
                return;
              }
              setError(null);
              setDraft({ ...draft, attachment: file });
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            aria-label="پیوست فایل"
            title="پیوست فایل"
            className="grid size-11 place-items-center rounded-full bg-element-bg text-text-muted hover:text-approve disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-5" aria-hidden="true">
              <path d="m20 11.5-8.2 8.2a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8" />
            </svg>
          </button>
          {!draft.voice && (
            <VoiceRecorder
              disabled={busy}
              onRecorded={(voice) => setDraft((current) => ({ ...current, voice }))}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={busy || isDraftEmpty(draft)}
          className="min-h-11 rounded-full bg-primary-green px-6 text-sm font-bold text-black hover:bg-primary-green-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "در حال ارسال..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
