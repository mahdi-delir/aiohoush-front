"use client";

import StatusBar from "@/components/ui/status-bar";
import { Video } from "@/components/ui/video";
import useCourse from "@/features/hooks/use-course";
import Image from "next/image";
import Enter from "@/assets/puffy-icons/enter.svg";
import Buy from "@/assets/puffy-icons/buy.svg";
import Left from "@/assets/puffy-icons/left.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CourseContentProps = {
  slug: string;
};

export default function CourseContent({ slug }: CourseContentProps) {
  const router = useRouter();
  const { data: res, isPending, isError } = useCourse(slug);
  const [openSeasons, setOpenSeasons] = useState<Record<number, boolean>>({});
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(
    null,
  );
  function toggleSeason(index: number) {
    setOpenSeasons((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  if (isPending) {
    return <p>در حال دریافت اطلاعات دوره...</p>;
  }

  if (isError && !res) {
    return <p>دریافت اطلاعات دوره با خطا مواجه شد.</p>;
  }

  if (!res) {
    return <p>دوره پیدا نشد.</p>;
  }

  const course = res.data;
  const episodes = course.seasons.flatMap((season) => season.episods);

  const selectedEpisode =
    episodes.find((episode) => episode.id === selectedEpisodeId) ?? episodes[0];

  return (
    <div className="flex flex-col gap-8">
      <section>
        {selectedEpisode ? (
          <Video
            key={selectedEpisode.id}
            item={selectedEpisode}
            poster={selectedEpisode.cover}
          />
        ) : (
          <p>هنوز جلسه‌ای برای این دوره ثبت نشده است.</p>
        )}
      </section>

      <section>
        <span className="text-sm text-text-muted">
          {course.course.duration} | {course.course.episod_count} جلسه
        </span>
      </section>

      <section className="flex justify-around border-b border-text-muted/30">
        <span className="border-b-2 border-primary-green px-4">
          جلسات‌دوره
        </span>
        <span className="px-4">درباره‌دوره</span>
      </section>
      <section>
        <ul className="flex flex-col gap-4">
          {course.seasons.map((season, i) => {
            const isOpen = !!openSeasons[i];

            return (
              <li key={i} className="border-b border-text-muted/50 py-2">
                <div
                  className="flex justify-between items-center"
                  onClick={() => toggleSeason(i)}
                  aria-expanded={isOpen}
                  aria-controls={`season-episodes-${i}`}
                  aria-label={`${isOpen ? "بستن" : "باز کردن"} ${season.title}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-element-bg p-2 rounded-full cursor-pointer">
                      <Image
                        src={Left}
                        width={20}
                        height={20}
                        alt=""
                        className={`transition-transform duration-800 ${
                          isOpen ? "-rotate-90" : ""
                        }`}
                      />
                    </div>

                    <h3 className="font-bold text-sm">{season.title}</h3>
                    <span className="text-text-muted text-sm">{season.subject}</span>
                  </div>

                  <span className="text-text-muted text-xs">
                    {season.episod_count} جلسه | {season.duration}
                  </span>
                </div>

                <div id={`season-episodes-${i}`} hidden={!isOpen}>
                  <ul className="flex flex-col justify-center px-4">
                    {season.episods.map((episod) => (
                      <li
                        key={episod.id}
                        onClick={() => setSelectedEpisodeId(episod.id)}
                        aria-pressed={selectedEpisode?.id === episod.id}
                        className={`flex items-center justify-between my-2 p-2 border-b border-text-muted/50 rounded-icon ${selectedEpisode?.id === episod.id ? "bg-card-bg" : ""}`}
                      >
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-sm px-3 py-1.5 rounded-full w-fit ${selectedEpisode?.id === episod.id ? "bg-primary-green" : "bg-element-bg"}`}
                          >
                            {episod.order}
                          </span>
                          <h4>{episod.short_desc}</h4>
                        </div>

                        <div className="relative w-1/3 rounded-icon overflow-hidden">
                          <Image
                            src={episod.cover}
                            width={1000}
                            height={1000}
                            alt={episod.title ?? ""}
                            className="max-w-full max-h-full"
                          />

                          <span className="absolute bottom-1 right-3 bg-black px-1 rounded-icon text-xs">
                            {episod.duration}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
