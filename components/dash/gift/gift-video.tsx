"use client";
import { useSearchParams } from "next/navigation";
import { useGetGiftVideo } from "@/features/hooks/use-giftvideo";
import { VideoPlayer } from "@/components/ui/video-player";
import Button from "@/components/ui/button";
export default function GiftVideo() {

  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  const { data, isPending, isError } = useGetGiftVideo(category);
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
  if (isError || !data) {
    return (
      <div className="bg-card-bg flex aspect-video items-center justify-center rounded-xl">
        <span>خطا در دریافت ویدیو</span>
      </div>
    );
  }
  return (
    <section className="rounded-square overflow-hidden bg-card-bg">
      <VideoPlayer src={data.data.playerUrl} />
      <div className="px-4 mt-4 mb-2">
        {data.data.title && (
          <h2 className="font-bold text-xl">{data.data.title}</h2>
        )}
        <div className="flex gap-2 justify-end">
          <Button
            variant="secondary"
            size="sm"
            className="w-fit"
          >
            دریافت سورس کد
          </Button>
          <Button variant="secondary" size="sm" className="w-fit">
            ارسال تمرینات
          </Button>
        </div>
      </div>
    </section>
  );
}
