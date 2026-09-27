"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";
import type { HomeworkAttachment } from "@/types/homework";
import { getHomeworkAttachmentUrl } from "@/lib/homework-display";

function FeedbackVideo({
  url,
  hls,
  title,
}: {
  url: string;
  hls: boolean;
  title: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || !hls) return;
    let disposed = false;
    let player: Hls | undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      void import("hls.js")
        .then(({ default: HlsPlayer }) => {
          if (disposed) return;
          if (!HlsPlayer.isSupported()) {
            setFailed(true);
            return;
          }
          player = new HlsPlayer();
          player.on(HlsPlayer.Events.ERROR, (_, data) => {
            if (data.fatal && !disposed) setFailed(true);
          });
          player.loadSource(url);
          player.attachMedia(video);
        })
        .catch(() => {
          if (!disposed) setFailed(true);
        });
    }
    return () => {
      disposed = true;
      player?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [url, hls]);

  return (
    <div className="space-y-2">
      <video
        ref={ref}
        src={hls ? undefined : url}
        controls
        playsInline
        preload="none"
        aria-label={title}
        className="aspect-video w-full rounded-xl bg-black"
        onError={() => setFailed(true)}
      />
      {failed && (
        <p role="status" className="text-sm text-danger">
          پخش ویدئو ممکن نیست؛ از لینک فایل استفاده کنید.
        </p>
      )}
    </div>
  );
}

function FeedbackAudio({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="space-y-2">
      <audio
        src={url}
        controls
        preload="none"
        aria-label={title}
        className="w-full"
        onError={() => setFailed(true)}
      />
      {failed && (
        <p role="status" className="text-sm text-danger">
          پخش صوت ممکن نیست؛ از لینک فایل استفاده کنید.
        </p>
      )}
    </div>
  );
}

export default function HomeworkAttachmentView({
  item,
}: {
  item: HomeworkAttachment;
}) {
  const url = getHomeworkAttachmentUrl(item.url);
  const kind = { file: "فایل", audio: "صوت", video: "ویدئو" }[item.kind];
  return (
    <div className="space-y-3 rounded-2xl bg-element-bg p-3 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="min-w-0 break-all">
          <span className="text-text-muted">{kind}: </span>
          <bdi>{item.name}</bdi>
        </span>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-approve underline underline-offset-4"
          >
            باز کردن فایل
          </a>
        )}
      </div>
      {!url ? (
        <p className="text-xs text-text-muted">
            لینک فایل در دسترس نیست.
        </p>
      ) : item.kind === "video" ? (
        <FeedbackVideo
          key={`${url}:${item.delivery}`}
          url={url}
          hls={item.delivery === "hls"}
          title={item.name}
        />
      ) : item.kind === "audio" ? (
        <FeedbackAudio key={url} url={url} title={item.name} />
      ) : null}
    </div>
  );
}
