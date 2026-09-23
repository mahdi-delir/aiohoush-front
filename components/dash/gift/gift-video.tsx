"use client";
import { useSearchParams } from "next/navigation";
import { useGetGiftVideo } from "@/features/hooks/use-giftvideo";
import { VideoPlayer } from "@/components/ui/video-player";
import Button from "@/components/ui/button";
export default function GiftVideo() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const { data: res, isPending, isError } = useGetGiftVideo(category);
  if (!category) {
    return (
      <div className="bg-card-bg flex aspect-video items-center justify-center rounded-square">
        <span>یک دسته‌بندی انتخاب کنید</span>
      </div>
    );
  }
  if (isPending) {
    return (
      <div className="bg-card-bg aspect-video animate-pulse rounded-square" />
    );
  }
  if (isError || !res.data) {
    return (
      <div className="bg-card-bg flex aspect-video items-center justify-center rounded-xl">
        <span>خطا در دریافت ویدیو</span>
      </div>
    );
  }
  const video = res.data.videos.find((item) => item.slug === category);
  return (
    <section className="rounded-square overflow-hidden bg-card-bg">
      {video?.title && <h2 className="font-bold text-xl m-4">{video.title}</h2>}
      <VideoPlayer src={video?.playerUrl ?? ""} />
      <div className="flex gap-2 justify-end">
        {video?.has_source_code && (
          <Button variant="secondary" size="sm" className="w-fit m-4">
            دریافت سورس کد
          </Button>
        )}
        {video?.has_homework && (
          <Button variant="secondary" size="sm" className="w-fit m-4">
            ارسال تمرینات
          </Button>
        )}
      </div>
      
    </section>
  );
}
