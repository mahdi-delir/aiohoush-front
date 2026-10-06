"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import Button from "./button";
import { VideoItem } from "@/types/video";
import FileUpload from "./file-upload";
import { UploadTarget } from "@/lib/upload-files";
import { useWatchTracker, type WatchTarget } from "@/features/watch/use-watch-tracker";

interface VideoPlayerProps extends Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "item"
> {
  item: VideoItem;
  homeworkUpload?: UploadTarget;
  /** شناسهٔ جلسهٔ دوره برای ثبت پیشرفت تماشا. */
  trackSessionId?: number;
  /** شناسهٔ ویدئوی هدیه برای ثبت پیشرفت تماشا. */
  trackGiftId?: number;
  /** وقتی ویدئو تکمیل شد یا نوبت تماشا تمام شد. */
  onWatchProgress?: () => void;
}

export function Video({
  item,
  className,
  homeworkUpload,
  trackSessionId,
  trackGiftId,
  onWatchProgress,
  ...videoProps
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isLocked = item.is_locked === true;

  const watchTarget: WatchTarget | undefined = isLocked
    ? undefined
    : trackSessionId
      ? { kind: "session", id: trackSessionId }
      : trackGiftId
        ? { kind: "gift", id: trackGiftId }
        : undefined;

  useWatchTracker(videoRef, watchTarget, onWatchProgress);

  async function handleSourceDownload() {
    setDownloadError(null);
    setIsDownloading(true);

    try {
      await downloadSessionSourceCode(item.id);
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "دریافت سورس کد با خطا مواجه شد.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !item.playerUrl) return;

    setHasError(false);

    let hls: Hls | null = null;

    // فایل معمولی (مثلاً mp4) مستقیم پخش می‌شود؛ hls.js فقط برای m3u8.
    const isHls = /\.m3u8(\?|#|$)/i.test(item.playerUrl);

    if (!isHls) {
      video.src = item.playerUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls();

      hls.loadSource(item.playerUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setHasError(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = item.playerUrl;
    } else {
      setHasError(true);
    }

    return () => {
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [item.playerUrl]);

  if (isLocked) {
    return (
      <section className="rounded-square overflow-hidden bg-card-bg">
        {item?.title && <h2 className="font-bold text-xl m-4">{item.title}</h2>}
        <div className="flex aspect-video flex-col items-center justify-center gap-2 bg-black px-4 text-center text-sm text-white">
          <span className="font-bold">این جلسه قفل است</span>
          <span className="text-text-muted">
            برای مشاهدهٔ این جلسه باید دوره را تهیه کنید.
          </span>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-square bg-black text-sm text-white">
        پخش این ویدیو امکان‌پذیر نیست
      </div>
    );
  }

  return (
    <section className="rounded-square overflow-hidden bg-card-bg">
      {item?.title && <h2 className="font-bold text-xl m-4">{item.title}</h2>}
      <video
        ref={videoRef}
        controls
        playsInline
        className={cn("aspect-video w-full", className)}
        {...videoProps}
      />
      <div className="flex justify-between">
        {item?.has_homework && (
          <div className="m-4">
            <FileUpload
              key={`${item.id}:${item.playerUrl ?? ""}`}
              target={homeworkUpload}
              label="ارسال تمرین"
            />
          </div>
          // <Button variant="secondary" size="sm" className="w-fit m-4">
          //   ارسال تمرین
          // </Button>
        )}
        {item?.has_source_code && item.source_code_url && (
          <div className="m-4 flex flex-col items-end gap-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-fit"
              disabled={isDownloading}
              onClick={handleSourceDownload}
            >
              {isDownloading ? "در حال دریافت..." : "دریافت سورس کد"}
            </Button>
            {downloadError && (
              <span role="alert" className="text-xs text-danger">
                {downloadError}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}


function getFileName(
  contentDisposition: string | null,
): string {
  if (!contentDisposition) return "source-code";

  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      // ادامه با filename ساده
    }
  }

  const plain = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return plain?.[1] ?? "source-code";
}

/*
 * سورس کد از BFF (same-origin) دریافت می‌شود تا توکن کاربر
 * سمت سرور اضافه و دسترسی در Django بررسی شود.
 */
async function downloadSessionSourceCode(
  sessionId: number,
): Promise<void> {
  const response = await fetch(
    `/api/course-sessions/${sessionId}/source-code`,
    {
      credentials: "same-origin",
    },
  );

  // خطاهای قابل‌پیش‌بینی به‌صورت JSON با success=false برمی‌گردند
  // (حتی با HTTP 200)؛ فایل واقعی هرگز JSON نیست.
  const contentType = response.headers.get("Content-Type") ?? "";

  if (!response.ok || contentType.includes("application/json")) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.message || "دریافت سورس کد با خطا مواجه شد.",
    );
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = getFileName(
    response.headers.get("Content-Disposition"),
  );
  document.body.appendChild(link);
  link.click();
  link.remove();

  // کمی صبر تا مرورگر دانلود را شروع کند
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}
