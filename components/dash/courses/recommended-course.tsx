import Image from "next/image";
import Link from "next/link";

import { getRecommendedCourse } from "@/features/api/get-recommended-course";
import LOGO from "@/public/logo.svg";

export default async function RecommendedCourse() {
  const course = await getRecommendedCourse();

  if (!course) return null;

  const details = [
    course.duration ? `${course.duration} آموزش` : null,
    course.level,
  ]
    .filter(Boolean)
    .join("، ");

  return (
    <section className="bg-card-bg w-full rounded-square flex justify-between p-4 gap-4 shadow-2xs shadow-primary-green">
      <div className="min-w-0 flex-1 flex flex-col gap-4 justify-between">
        <div className="">
          <span className="text-xs text-approve bg-approve-bg rounded-icon px-3 py-1">
            پیشنهادی
          </span>
        </div>
        <div className="">
          <h2 className="font-bold text-2xl">{course.title}</h2>
          {details && <p className="text-text-muted">{details}</p>}
        </div>

        <div className="">
          <Link
            href={`/dashboard/courses/${encodeURIComponent(course.slug)}`}
            className="flex h-10 w-full max-w-52 items-center justify-center rounded-2xl bg-primary-green px-4 text-lg font-bold text-black"
          >
            نمایش دوره
          </Link>
        </div>
      </div>
      <div className="relative overflow-hidden w-1/3 shrink-0 self-start bg-element-bg rounded-icon aspect-square">
        <Image
          alt={course.title}
          src={course.cover || LOGO}
          fill
          unoptimized={Boolean(course.cover)}
          className="object-cover"
        />
      </div>
    </section>
  );
}
