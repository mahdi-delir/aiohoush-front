import CourseCategoryFilter from "@/components/dash/courses/category";
import Button from "@/components/ui/button";
import Input from "@/components/ui/text-input";
import Image from "next/image";

export default function Course() {
  return (
    <div className="flex flex-col gap-4">
      <Input type="search" placeholder="جست‌وجو در دوره‌ها" />
      <section className="bg-card-bg w-full rounded-square flex justify-between p-4 gap-4">
        <div className="w-2/3 flex flex-col gap-4">
          <div className="">
            <span className="text-xs text-approve bg-approve-bg rounded-icon px-3 py-1">
              پیشنهادی
            </span>
          </div>
          <div className="">
            <h2 className="font-bold text-2xl">دوره مقدماتی پایتون</h2>
            <p className="text-text-muted">25 ساعت آموزش ، مقدماتی</p>
          </div>

          <div className="">
            <Button className="font-bold max-w-52">نمایش دوره</Button>
          </div>
        </div>
        <div className="bg-element-bg w-1/3 rounded-square overflow-hidden">
          <Image
            alt="دوره مقدماتی پایتون"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3dCiwROrLu0dM5LLR23dRz2dPWBfu6ijBIM_Y2ai2dw&s=10"
            width={500}
            height={500}
            className="w-full h-full"
          />
        </div>
      </section>
      <CourseCategoryFilter />

    </div>
  );
}
