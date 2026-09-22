"use-client";

import Hls from "hls.js";
import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface VideoPlayerProps extends Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "src"
> {
  src: string;
}

export function VideoPlayer({
  src,
  className,
  ...videoProps
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    setHasError(false);

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();

      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setHasError(true);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      setHasError(true);
    }

    return () => {
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  if (hasError) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-black text-sm text-white">
        پخش این ویدیو امکان‌پذیر نیست
      </div>
    );
  }

  return (
      <video
      ref={videoRef}
      controls
      playsInline
      className={cn("aspect-video w-full", className)}
      {...videoProps}
    />
  );
}
