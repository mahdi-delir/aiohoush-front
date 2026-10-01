"use client";

import { Video } from "@/components/ui/video";
import useCourse from "@/features/hooks/use-course";
import Image from "next/image";
import Left from "@/assets/puffy-icons/left.svg";
import { useId, useRef, useState } from "react";
import CourseHomework from "./course-homework";

const courseTabs = [
  { id: "episods", label: "جلسات دوره" },
  { id: "aboutCourse", label: "درباره دوره" },
  { id: "homework", label: "تمرین‌های من" },
] as const;

type CourseTab = (typeof courseTabs)[number]["id"];

type CourseContentProps = {
  slug: string;
};

export default function CourseContent({ slug }: CourseContentProps) {
  const { data: res, isPending, isError } = useCourse(slug);
  const tabId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [openSeasons, setOpenSeasons] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<CourseTab>("episods");
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
  const episodes = course?.seasons.flatMap((season) => season.episods);

  const selectedEpisode =
    episodes?.find((episode) => episode.id === selectedEpisodeId);

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
          {course?.course.duration} | {course?.course.episod_count} جلسه
        </span>
      </section>

      <section
        role="tablist"
        aria-label="بخش‌های دوره"
        dir="rtl"
        className="flex border-b border-text-muted/30"
      >
        {courseTabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`${tabId}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tabId}-panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`flex-1 px-2 py-3 text-sm whitespace-nowrap border-b-2 focus-visible:outline-2 focus-visible:outline-primary-green ${activeTab === tab.id ? "border-primary-green text-approve" : "border-transparent text-text-muted"}`}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => {
              let next: number;
              if (event.key === "ArrowLeft")
                next = (index + 1) % courseTabs.length;
              else if (event.key === "ArrowRight")
                next = (index + courseTabs.length - 1) % courseTabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = courseTabs.length - 1;
              else return;
              event.preventDefault();
              tabRefs.current[next]?.focus();
              // Manual activation: Enter/Space activates the focused button.
            }}
          >
            {tab.label}
          </button>
        ))}
      </section>
      <section
        id={`${tabId}-panel-episods`}
        role="tabpanel"
        aria-labelledby={`${tabId}-tab-episods`}
        hidden={activeTab !== "episods"}
        tabIndex={0}
      >
        <ul className="flex flex-col gap-4">
          {course?.seasons.map((season, i) => {
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
                    <span className="text-text-muted text-sm">
                      {season.subject}
                    </span>
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

                        <div className="relative w-1/3 aspect-video rounded-icon overflow-hidden">
                          <Image
                            src={episod.cover}
                            fill
                            alt={episod.title ?? ""}
                            className="object-cover"
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
      <section
        id={`${tabId}-panel-aboutCourse`}
        role="tabpanel"
        aria-labelledby={`${tabId}-tab-aboutCourse`}
        hidden={activeTab !== "aboutCourse"}
        tabIndex={0}
      >
        <p className="text-justify">{course?.course.description}</p>
      </section>
      <section
        id={`${tabId}-panel-homework`}
        role="tabpanel"
        aria-labelledby={`${tabId}-tab-homework`}
        hidden={activeTab !== "homework"}
        tabIndex={0}
      >
        {activeTab === "homework" && (
          <CourseHomework key={course?.course.id} courseId={course?.course.id ?? 1} />
        )}
      </section>
    </div>
  );
}
