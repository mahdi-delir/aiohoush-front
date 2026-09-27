"use client";

import { useId, useState } from "react";
import type {
  ProjectCategory,
  ProjectGalleryData,
  PublicProject,
  PublicStudentProfile,
} from "@/types/project";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve";

const artworkColors = {
  workspace: "bg-emerald-950 text-emerald-300",
  analytics: "bg-slate-800 text-blue-300",
  learning: "bg-indigo-950 text-violet-300",
  portfolio: "bg-stone-800 text-orange-200",
} satisfies Record<PublicProject["artwork"], string>;

const categories = [
  { id: "aiohoush", label: "پروژه‌های آیوهوش" },
  { id: "students", label: "پروژه‌های دانشجویان" },
] as const;

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim();
}

function safeLink(value: string | null, github = false): string | null {
  if (!value || /[\u0000-\u0020\\]/.test(value)) return null;

  if (!github && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (github && url.hostname !== "github.com") return null;

    return url.href;
  } catch {
    return null;
  }
}

function Icon({
  type,
  className = "size-5 shrink-0",
}: {
  type: "search" | "arrow" | "file" | "code";
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {type === "search" && (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </>
      )}
      {type === "arrow" && <path d="M19 12H5m6-6-6 6 6 6" />}
      {type === "file" && (
        <>
          <path d="M14 3H6v18h12V7zM14 3v5h4" />
          <path d="M9 13h6m-6 4h4" />
        </>
      )}
      {type === "code" && <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" />}
    </svg>
  );
}

function ProjectArtwork({ variant }: { variant: PublicProject["artwork"] }) {
  return (
    <div
      aria-hidden="true"
      dir="ltr"
      className={`relative h-48 overflow-hidden px-8 pt-9 sm:h-44 sm:px-5 sm:pt-8 ${artworkColors[variant]}`}
    >
      <span className="absolute top-3 left-4 font-mono text-xs tracking-widest opacity-80">
        {variant.toUpperCase()} / PROJECT
      </span>

      <div className="h-44 -rotate-3 overflow-hidden rounded-t-xl border border-white/15 bg-slate-950 shadow-2xl sm:h-40">
        <div className="flex h-6 items-center gap-1 border-b border-white/10 px-2">
          {[0, 1, 2].map((dot) => (
            <i key={dot} className="size-1 rounded-full bg-slate-600" />
          ))}
          <span className="ml-auto font-mono text-xs text-slate-400">
            aiohoush / studio
          </span>
        </div>

        {variant === "analytics" ? (
          <div className="px-4 py-3">
            <strong className="block text-sm">Overview</strong>
            <span className="mt-1 block text-xs text-slate-400">
              Activity this week
            </span>
            <div className="flex h-16 items-end justify-between gap-1.5 pt-2">
              {["h-5", "h-8", "h-6", "h-11", "h-9", "h-14", "h-10"].map(
                (heightClass, index) => (
                  <i
                    key={heightClass}
                    className={`w-1/7 rounded-t bg-current ${heightClass} ${index % 2 ? "opacity-25" : "opacity-60"}`}
                  />
                ),
              )}
            </div>
          </div>
        ) : variant === "portfolio" ? (
          <div className="relative overflow-hidden p-4">
            <div className="absolute top-4 right-2 size-16 rounded-full border-8 border-orange-300/20 ring-8 ring-orange-300/5" />
            <span className="relative font-mono text-xs tracking-widest">
              HELLO, WORLD.
            </span>
            <strong className="relative mt-2 block font-serif text-lg leading-tight font-normal text-orange-100">
              Made to
              <br />
              make a difference.
            </strong>
            <i className="mt-2 block h-2 w-10 rounded-full bg-current" />
          </div>
        ) : (
          <div className="flex gap-2 px-2 py-3">
            <aside className="grid w-6 content-start gap-2">
              {[0, 1, 2, 3].map((line) => (
                <i key={line} className="h-1 w-5 rounded bg-slate-700" />
              ))}
            </aside>
            <div className="min-w-0 flex-1">
              <strong className="block text-xs font-normal text-slate-200">
                {variant === "learning"
                  ? "Small steps. Big goals."
                  : "A place for your ideas."}
              </strong>
              <div className="flex gap-1.5 pt-3">
                {[0, 1, 2].map((card) => (
                  <div
                    key={card}
                    className="h-16 flex-1 rounded border border-white/5 bg-white/5 p-1.5"
                  >
                    <b className="mb-2 block size-2.5 rounded bg-current opacity-60" />
                    <i className="mt-1 block h-0.5 w-5/6 bg-slate-500/30" />
                    <i className="mt-1 block h-0.5 w-5/6 bg-slate-500/30" />
                    <span className="mt-2 block h-1 w-1/2 bg-current opacity-50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <span className="absolute right-3 bottom-2 rounded-md border border-white/10 bg-slate-950/90 px-2 py-0.5 text-xs text-slate-200">
        طرح نمایشی
      </span>
    </div>
  );
}

function StudentIntroduction({ student }: { student?: PublicStudentProfile }) {
  return (
    <section
      className="mt-1 border-t border-white/5 pt-3"
      aria-label="دربارهٔ سازندهٔ پروژه"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-violet-300/10 text-sm text-violet-200"
        >
          {student?.name.slice(0, 1) ?? "؟"}
        </span>
        <div>
          <strong className="block text-sm font-semibold">
            {student?.name ?? "دانشجو"}
          </strong>
          <span className="mt-1 block text-xs text-text-muted">
            دانشجوی آیوهوش
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs leading-6 whitespace-pre-wrap wrap-anywhere text-text-muted">
        {student?.bio || "معرفی کوتاهی در پروفایل ثبت نشده است."}
      </p>
    </section>
  );
}

function ProjectFiles({ files }: { files: PublicProject["files"] }) {
  return (
    <details className="group/files">
      <summary
        className={`flex min-h-11 cursor-pointer list-inside items-center gap-2 rounded-xl border border-primary-green/25 bg-primary-green/5 p-2.5 text-xs text-approve hover:bg-primary-green/10 group-open/files:bg-primary-green/15 ${focusClasses}`}
      >
        <Icon type="file" />
        <span>فایل‌های پروژه</span>
        <span className="ms-auto text-xs">
          {files.length.toLocaleString("fa-IR")}
        </span>
      </summary>
      <ul className="pt-2">
        {files.length ? (
          files.map((file) => {
            const url = safeLink(file.url);

            return (
              <li key={file.id} className="py-2 text-xs text-text-muted">
                {url ? (
                  <a
                    href={url}
                    download
                    rel="noopener noreferrer"
                    className={`flex flex-col gap-1 rounded-lg bg-white/5 p-2 wrap-anywhere ${focusClasses}`}
                  >
                    <bdi className="text-xs">{file.name}</bdi>
                    <small className="text-xs text-approve">
                      {file.sizeLabel} · دریافت
                    </small>
                  </a>
                ) : (
                  <span>فایل در دسترس نیست</span>
                )}
              </li>
            );
          })
        ) : (
          <li className="py-2 text-xs text-text-muted">
            هنوز فایلی برای این پروژه ثبت نشده است.
          </li>
        )}
      </ul>
    </details>
  );
}

function ProjectCard({
  project,
  student,
}: {
  project: PublicProject;
  student?: PublicStudentProfile;
}) {
  const repository = safeLink(project.githubUrl, true);

  return (
    <article
      className="
        flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-card-bg
        hover:border-primary-green/25 motion-safe:transition-colors motion-safe:duration-200
      "
    >
      <ProjectArtwork variant={project.artwork} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <span className="text-xs text-approve">
          {project.category === "students"
            ? "ساختهٔ دانشجویان"
            : "ساختهٔ آیوهوش"}
        </span>
        <h3 className="text-base leading-7 font-bold">{project.title}</h3>
        <p className="text-sm leading-7 text-text-muted">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-1.5" aria-label="فناوری‌های پروژه">
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-lg border border-white/5 px-2 py-1 font-mono text-xs text-slate-300"
            >
              <bdi>{technology}</bdi>
            </li>
          ))}
        </ul>
        {project.category === "students" && (
          <StudentIntroduction student={student} />
        )}
        <div className="mt-auto grid gap-2 pt-4">
          <ProjectFiles files={project.files} />
          {repository && (
            <a
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`مخزن GitHub پروژهٔ ${project.title}`}
              className={`flex items-center justify-center gap-2 rounded-xl border border-white/10 p-2.5 text-xs hover:bg-primary-green/10 ${focusClasses}`}
            >
              <Icon type="code" />
              <span>GitHub</span>
              <Icon type="arrow" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectGallery({ data }: { data: ProjectGalleryData }) {
  const searchId = useId();
  const [category, setCategory] = useState<ProjectCategory>("aiohoush");
  const [search, setSearch] = useState("");
  const students = new Map(
    data.students.map((student) => [student.id, student]),
  );
  const query = normalize(search);
  const projects = data.projects.filter((project) => {
    const student = project.studentId
      ? students.get(project.studentId)
      : undefined;
    const searchable = normalize(
      [
        project.title,
        project.description,
        ...project.technologies,
        student?.name ?? "",
      ].join(" "),
    );

    return project.category === category && searchable.includes(query);
  });

  return (
    <div className="grid gap-6 pb-8 text-text-primary">
      <header className="relative isolate overflow-hidden rounded-square border border-primary-green/20 bg-card-bg p-6 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-16 -z-10 size-64 rounded-full bg-primary-green/10 blur-3xl"
        />
        <div className="flex items-center gap-2 text-xs text-approve">
          <span className="size-1.5 rounded-full bg-current" />
          گالری پروژه‌ها
          <span className="h-px w-11 bg-approve/25" />
        </div>
        <div className="mt-6 mb-5 flex items-center justify-between gap-4">
          <h1 className="text-3xl leading-relaxed font-extrabold tracking-tight sm:text-4xl">
            از یادگیری،
            <br />
            <em className="text-approve not-italic">تا ساختن.</em>
          </h1>
          <div
            aria-hidden="true"
            className="
              flex h-24 w-20 shrink-0 -rotate-6 flex-col items-center justify-center gap-3 rounded-3xl
              border border-approve/20 bg-primary-green/5 text-approve sm:h-28 sm:w-24
            "
          >
            <Icon type="code" className="size-11 stroke-1" />
            <span className="font-mono text-xs">BUILD / SHARE</span>
          </div>
        </div>
        <p className="max-w-lg text-sm leading-8 text-text-muted">
          پروژه‌های آیوهوش و دست‌ساخته‌های دانشجویان را ببینید، فایل‌ها را بررسی
          کنید و برای ایدهٔ بعدی‌تان الهام بگیرید.
        </p>
        <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/5 pt-4 text-xs text-slate-300">
          <span>ایده‌هایی که به اجرا رسیده‌اند</span>
          <Icon type="arrow" className="size-5 shrink-0 text-approve" />
        </div>
      </header>

      <section
        className="grid gap-3.5"
        aria-label="جست‌وجو و دسته‌بندی پروژه‌ها"
      >
        <div
          className="flex gap-1 rounded-2xl border border-white/5 bg-card-bg p-1"
          role="group"
          aria-label="دسته‌بندی اصلی"
        >
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => setCategory(item.id)}
              className={`flex min-h-12 flex-1 cursor-pointer flex-wrap items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs motion-safe:transition-colors motion-safe:duration-200 ${focusClasses} ${category === item.id ? "bg-primary-green font-bold text-emerald-950" : "bg-transparent text-text-muted"}`}
            >
              {item.label}
              <span
                className={`min-w-5 rounded-md px-1.5 py-0.5 text-xs ${category === item.id ? "bg-emerald-950/10" : "bg-white/5"}`}
              >
                {data.projects
                  .filter((project) => project.category === item.id)
                  .length.toLocaleString("fa-IR")}
              </span>
            </button>
          ))}
        </div>
        <label
          htmlFor={searchId}
          className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-white/10 bg-card-bg/50 px-4 text-text-muted"
        >
          <Icon type="search" />
          <span className="sr-only">
            جست‌وجو در عنوان، فناوری یا نام سازنده
          </span>
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="نام پروژه، فناوری یا سازنده…"
            className={`min-w-0 w-full border-0 bg-transparent py-3 text-sm text-text-primary placeholder:text-text-muted/80 ${focusClasses}`}
          />
        </label>
      </section>

      <section aria-labelledby="projects-list-heading">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 id="projects-list-heading" className="text-lg font-bold">
              {category === "students"
                ? "ساخته‌های دانشجویان"
                : "از کارگاه آیوهوش"}
            </h2>
            <p className="mt-1 text-xs leading-6 text-text-muted">
              {category === "students"
                ? "هر پروژه، روایت یک مسیر یادگیری."
                : "برای دیدن، بررسی‌کردن و یادگرفتن."}
            </p>
          </div>
          <span
            role="status"
            className="text-xs whitespace-nowrap text-text-muted"
          >
            {projects.length.toLocaleString("fa-IR")} پروژه
          </span>
        </div>
        {projects.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id} className="min-w-0">
                <ProjectCard
                  project={project}
                  student={
                    project.studentId
                      ? students.get(project.studentId)
                      : undefined
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 px-5 py-9 text-center text-text-muted">
            <Icon type="search" className="mx-auto mb-3 size-5" />
            <h3 className="text-base text-text-primary">
              {query ? "پروژه‌ای پیدا نشد" : "هنوز پروژه‌ای در این دسته نیست"}
            </h3>
            <p className="my-2 text-xs leading-6">
              {query
                ? "عنوان، نام سازنده یا فناوری دیگری را جست‌وجو کنید."
                : "پروژه‌های منتشرشده در این بخش نمایش داده می‌شوند."}
            </p>
            {query && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`cursor-pointer rounded-xl border-0 bg-element-bg px-4 py-2.5 text-approve ${focusClasses}`}
              >
                پاک کردن جست‌وجو
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
