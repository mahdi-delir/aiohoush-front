import CourseCategoryFilter from "@/components/dash/courses/category";
import CourseVideoList from "@/components/dash/courses/courses";
import Button from "@/components/ui/button";
import Input from "@/components/ui/text-input";
import Image from "next/image";
import { Suspense } from "react";

export default function Course() {
  return (
    <div className="flex flex-col gap-8">
      <Input type="search" placeholder="جست‌وجو در دوره‌ها" />
      <section className="bg-card-bg w-full rounded-square flex justify-between p-4 gap-4 shadow-2xs shadow-primary-green">
        <div className="min-w-0 flex-1 flex flex-col gap-4 justify-between">
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
        <div className="relative overflow-hidden w-1/3 shrink-0 self-start bg-element-bg rounded-icon aspect-square">
          <Image
            alt="دوره مقدماتی پایتون"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3dCiwROrLu0dM5LLR23dRz2dPWBfu6ijBIM_Y2ai2dw&s=10"
            fill
            className="object-cover"
          />
        </div>
      </section>
      <CourseCategoryFilter />
      <Suspense fallback={null}>
        <CourseVideoList />
      </Suspense>
    </div>
  );
}
