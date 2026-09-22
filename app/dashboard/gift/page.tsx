import GiftCategory from "@/components/dash/gift/gift-category";
import GiftVideo from "@/components/dash/gift/gift-video";
import Input from "@/components/ui/text-input";

export default function GiftPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="bg-card-bg rounded-square min-h-44 overflow-hidden">
        <h2 className="p-4">اینجا عکسی که پری میده قرار میگیره</h2>
      </section>
      <GiftCategory />
      <GiftVideo />
      <section className="mt-4">
        <h2 className="mb-2">چند تا از خوبی های آموزش در آیوهوش</h2>
        <div className="bg-card-bg rounded-square min-h-52 overflow-hidden">
          <h2 className="p-4">اینجا عکسی که پری میده قرار میگیره</h2>
        </div>
      </section>
    </div>
  );
}
