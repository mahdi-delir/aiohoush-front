import GiftVideos from "@/components/dash/gift/gift-video";

export default function GiftPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="min-h-44 overflow-hidden rounded-square bg-card-bg">
        <h2 className="p-4">هدیه‌های آموزشی آیوهوش</h2>
      </section>

      <GiftVideos />

      <section className="mt-4">
        <h2 className="mb-2">چند تا از خوبی‌های آموزش در آیوهوش</h2>

        <div className="min-h-52 overflow-hidden rounded-square bg-card-bg">
          <h2 className="p-4">اینجا عکس قرار می‌گیرد</h2>
        </div>
      </section>
    </div>
  );
}
