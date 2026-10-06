"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Video } from "@/components/ui/video";
import { useGiftVideos } from "@/features/hooks/use-gift-videos";
import { currentUserQueryKey } from "@/features/auth/queries/current-user";
import type { GiftVideoItem } from "@/types/gift-video";
import type { VideoItem } from "@/types/video";


function toVideoItem(
  gift: GiftVideoItem,
): VideoItem {
  return {
    id: gift.id,
    title: gift.title,
    playerUrl: gift.playerUrl ?? undefined,
    order: gift.order,
    duration: gift.duration,
    cover: gift.cover ?? "",
    has_source_code: false,
    has_homework: false,
    is_public: gift.is_public,
  };
}


export default function GiftVideos() {
  const queryClient = useQueryClient();
  const {
    data: response,
    isPending,
    isError,
  } = useGiftVideos();

  const [
    selectedId,
    setSelectedId,
  ] = useState<number | null>(null);

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <div className="aspect-video animate-pulse rounded-square bg-card-bg" />

        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="aspect-video animate-pulse rounded-2xl bg-card-bg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="rounded-square bg-card-bg p-6 text-center">
        دریافت ویدئوهای هدیه با خطا مواجه شد.
      </div>
    );
  }

  const videos = response.data.videos;

  if (!videos.length) {
    return (
      <div className="rounded-square bg-card-bg p-6 text-center">
        هنوز ویدئوی هدیه‌ای ثبت نشده است.
      </div>
    );
  }

  const selectedVideo =
    videos.find((video) => video.id === selectedId) ??
    videos[0];

  const otherVideos = videos.filter(
    (video) => video.id !== selectedVideo.id,
  );

  return (
    <section className="flex flex-col gap-4">
      <Video
        key={selectedVideo.id}
        item={toVideoItem(selectedVideo)}
        poster={selectedVideo.cover ?? undefined}
        trackGiftId={selectedVideo.id}
        // تا هیروی صفحهٔ اول («هدیه را دیده») به‌روز شود.
        onWatchProgress={() =>
          void queryClient.invalidateQueries({ queryKey: currentUserQueryKey })
        }
      />

      <div className="grid grid-cols-2 gap-4">
        {otherVideos.map((video) => (
          <button
            key={video.id}
            type="button"
            onClick={() => setSelectedId(video.id)}
            className="group relative aspect-video overflow-hidden rounded-2xl bg-card-bg text-right shadow-md transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-green"
            style={{
              backgroundImage: video.cover
                ? `url("${video.cover}")`
                : undefined,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <span className="absolute inset-0 bg-linear-to-t from-black via-black/55 to-black/5 transition-all duration-200 group-hover:from-black/90 group-hover:via-black/60" />

            <span className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3 text-white">
              <span className="line-clamp-2 text-sm font-bold leading-6">
                {video.title}
              </span>

              <span className="flex items-center gap-2 text-xs text-white/80">
                <span>ویدئوی هدیه</span>
                <span aria-hidden="true">•</span>
                <span>{video.duration}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
