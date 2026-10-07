"use client";

import { useEffect, useRef, useState } from "react";

const MAX_DURATION_MS = 5 * 60 * 1000;

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/ogg;codecs=opus",
  "audio/webm",
  "audio/mp4",
];

export function voiceFileExtension(mimeType: string): string {
  if (mimeType.includes("ogg")) return ".ogg";
  if (mimeType.includes("mp4")) return ".m4a";
  return ".webm";
}

function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes.toLocaleString("fa-IR")}:${seconds
    .toLocaleString("fa-IR")
    .padStart(2, "۰")}`;
}

export { formatDuration as formatVoiceDuration };

export default function VoiceRecorder({
  disabled,
  onRecorded,
}: {
  disabled?: boolean;
  onRecorded: (voice: { blob: Blob; durationMs: number }) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const discardRef = useRef(false);

  function cleanup() {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setElapsed(0);
  }

  useEffect(() => () => {
    discardRef.current = true;
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
  }, []);

  async function start() {
    setError(null);

    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("مرورگر شما از ضبط صدا پشتیبانی نمی‌کند.");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("دسترسی به میکروفون داده نشد.");
      return;
    }

    const mimeType = MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

    streamRef.current = stream;
    recorderRef.current = recorder;
    chunksRef.current = [];
    discardRef.current = false;

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      const durationMs = Date.now() - startedAtRef.current;
      const type = recorder.mimeType || mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      cleanup();

      if (!discardRef.current && blob.size > 0 && durationMs >= 500) {
        onRecorded({ blob, durationMs });
      }
    };

    startedAtRef.current = Date.now();
    recorder.start(250);
    setRecording(true);

    timerRef.current = window.setInterval(() => {
      const now = Date.now() - startedAtRef.current;
      setElapsed(now);
      if (now >= MAX_DURATION_MS) recorder.stop();
    }, 200);
  }

  function stop(discard: boolean) {
    discardRef.current = discard;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  if (recording) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-danger-bg px-3 py-1.5" role="status">
        <span aria-hidden="true" className="size-2.5 rounded-full bg-danger motion-safe:animate-pulse" />
        <span className="text-sm tabular-nums text-text-primary">{formatDuration(elapsed)}</span>
        <button
          type="button"
          onClick={() => stop(true)}
          className="rounded-full px-2 py-1 text-xs text-text-muted hover:text-text-primary"
        >
          لغو
        </button>
        <button
          type="button"
          onClick={() => stop(false)}
          className="rounded-full bg-primary-green px-3 py-1 text-xs font-bold text-black"
        >
          پایان ضبط
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={start}
        disabled={disabled}
        aria-label="ضبط پیام صوتی"
        title="ضبط پیام صوتی"
        className="grid size-11 place-items-center rounded-full bg-element-bg text-text-muted hover:text-approve disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="size-5" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      </button>
      {error && <p role="alert" className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
