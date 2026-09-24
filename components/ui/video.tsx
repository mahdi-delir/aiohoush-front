"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import Button from "./button";
import { VideoItem } from "@/types/video";

interface VideoPlayerProps extends Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "item"
> {
  item: VideoItem;
}

export function Video({
  item,
  className,
  ...videoProps
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !item.playerUrl) return;

    setHasError(false);

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
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
      <div className="flex gap-2 justify-end">
        {item?.has_source_code && (
          <Button variant="secondary" size="sm" className="w-fit m-4">
            دریافت سورس کد
          </Button>
        )}
        {item?.has_homework && (
          <Button variant="secondary" size="sm" className="w-fit m-4">
            ارسال تمرینات
          </Button>
        )}
      </div>
    </section>
  );
}
