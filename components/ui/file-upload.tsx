import {
  MAX_UPLOAD_FILE_BYTES,
  uploadFiles,
  UploadTarget,
} from "@/lib/upload-files";
import { isAxiosError } from "axios";
import { ChangeEvent, useId, useRef, useState } from "react";
import Button from "./button";
import StatusBar from "./status-bar";

type Phase =
  | "idle"
  | "preview"
  | "uploading"
  | "success"
  | "error"
  | "cancelled";
type SelectedFile = { name: string; size: number };

interface FileUploadProps {
  target?: UploadTarget;
  label?: string;
}

export default function FileUpload({
  target,
  label = "ارسال فایل",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const busy = phase === "uploading";

  const requestRef = useRef<AbortController | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [percent, setPercent] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const helpId = useId();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.currentTarget.files?.[0]
      ? [event.currentTarget.files[0]]
      : [];
    event.currentTarget.value = "";
    if (!selected.length || requestRef.current) return;
    const rejected = selected.filter(
      (file) => file.size > MAX_UPLOAD_FILE_BYTES,
    );
    const accepted = selected.filter(
      (file) => file.size <= MAX_UPLOAD_FILE_BYTES,
    );
    setErrors(
      rejected.map((file) => `${file.name}: حجم فایل بیشتر از ۵ مگابایت است.`),
    );
    setFiles(accepted.map(({ name, size }) => ({ name, size })));
    setPercent(null);
    setMessage("");
    if (!accepted.length) {
      setPhase("idle");
      return;
    }
    if (!target) {
      setPhase("preview");
      setMessage(
        "فایل‌ها انتخاب شدند؛ ارسال فایل هنوز فعال نیست و چیزی ارسال نشده است.",
      );
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setPhase("uploading");
    try {
      await uploadFiles({
        ...target,
        files: accepted,
        signal: controller.signal,
        onProgress: (value) => {
          if (requestRef.current === controller && !controller.signal.aborted) {
            setPercent(value);
          }
        },
      });
      if (requestRef.current !== controller || controller.signal.aborted)
        return;
      setPercent(100);
      setPhase("success");
      setMessage("سرور دریافت درخواست را تأیید کرد.");
    } catch (error) {
      if (requestRef.current !== controller || controller.signal.aborted)
        return;
      setPhase("error");
      setMessage(
        isAxiosError(error) && error.response?.status === 413
          ? "حجم درخواست از محدودیت سرور بیشتر است."
          : "پاسخ موفق دریافت نشد. پیش از ارسال دوباره، وضعیت ثبت فایل ها را بررسی کنید.",
      );
    } finally {
      if (requestRef.current === controller) requestRef.current = null;
    }
  }
  function cancelUpload() {
    const controller = requestRef.current;
    requestRef.current = null;
    controller?.abort();
    setPhase("cancelled");
    setMessage(
      "ارسال در این دستگاه متوقف شد؛ ممکن است سرور بخشی یا تمام درخواست را دریافت کرده باشد.",
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <input
        type="file"
        name=""
        id=""
        hidden
        aria-label={label}
        ref={inputRef}
        disabled={busy}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={busy}
          aria-describedby={helpId}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "در حال ارسال…" : label}
        </Button>
      </div>
      <p id={helpId} className="text-xs text-text-muted">
        همهٔ فرمت‌ها مجازند؛ حداکثر حجم هر فایل ۵ مگابایت است.
      </p>
      {files.length > 0 && (
        <ul className="text-sm" aria-label="فایل‌های انتخاب‌شده">
          {files.map((file, index) => (
            <li key={index} className="flex items-start justify-between gap-2">
              <bdi className="min-w-0 break-all">{file.name}</bdi>
              <span className="shrink-0 text-text-muted">
                {(file.size / 1_000_000).toLocaleString("fa-IR", {
                  maximumFractionDigits: 2,
                })}{" "}
                MB
              </span>
            </li>
          ))}
        </ul>
      )}
      {errors.length > 0 && (
        <ul role="alert" className="text-sm text-danger">
          {errors.map((error, index) => (
            <li className="break-all" key={index}>
              {error}
            </li>
          ))}
        </ul>
      )}
      {(busy || phase === "success") && (
        <div className="space-y-2">
          <StatusBar percent={percent} label="پیشرفت ارسال مجموع فایل‌ها" />
          {busy && percent !== null && percent < 100 && (
            <p className="text-xs text-text-muted">
              {percent.toLocaleString("fa-IR")}٪ ارسال شده
            </p>
          )}
        </div>
      )}
      {busy && (
        <Button type="button" variant="danger" size="sm" onClick={cancelUpload}>
          لغو ارسال
        </Button>
      )}
      <p role="status" className="text-sm text-text-muted">
        {busy
          ? percent === 100
            ? "انتقال داده تمام شد؛ در انتظار پاسخ سرور…"
            : "در حال ارسال فایل‌ها…"
          : message}
      </p>
    </div>
  );
}
