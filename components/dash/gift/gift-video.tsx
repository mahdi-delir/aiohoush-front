"use client";
import { useSearchParams } from "next/navigation";
import { useGetVideo } from "@/features/hooks/use-video";
import { Video } from "@/components/ui/video";
export default function GiftVideo() {

  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;
  
  const { data: res, isPending, isError } = useGetVideo(category);
  
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
  
  if (!res.data.video) {
    return (
      <div className="bg-card-bg flex aspect-video items-center justify-center rounded-square">
        <span>ویدیو یافت نشد</span>
      </div>
    );
  }
  
  return (
    <Video item={res.data.video}/>
  );
}
