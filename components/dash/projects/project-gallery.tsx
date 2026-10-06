"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

import type { ProjectGalleryData, ProjectKind } from "@/types/project";
import ProjectCard from "./project-card";
import { focusClasses } from "./project-utils";

const categories = [
  { id: "aiohoush", label: "پروژه‌های آیوهوش" },
  { id: "student", label: "پروژه‌های دانشجویان" },
] as const;

const SEARCH_DELAY_MS = 350;

function SearchIcon({ className = "size-5 shrink-0" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function CodeIcon({ className = "size-5 shrink-0" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" />
    </svg>
  );
}

export default function ProjectGallery() {
  const searchId = useId();
  const technologyId = useId();

  const [kind, setKind] = useState<ProjectKind>("aiohoush");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<ProjectGalleryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جست‌وجو بعد از توقف تایپ
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, SEARCH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ kind, page: String(page) });
    if (query) params.set("q", query);
    if (technology) params.set("technology", technology);

    setLoading(true);

    fetch(`/api/projects?${params}`, {
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((body) => {
        if (!body?.success) throw new Error(body?.message || "دریافت پروژه‌ها ممکن نشد.");
        setData(body.data as ProjectGalleryData);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return;
        setError(reason instanceof Error ? reason.message : "دریافت پروژه‌ها ممکن نشد.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [kind, query, technology, page]);

  function selectKind(next: ProjectKind) {
    setKind(next);
    setPage(1);
  }

  const projects = data?.projects ?? [];

  return (
    <div className="grid gap-6 pb-8 text-text-primary">
      <header className="relative isolate overflow-hidden rounded-square border border-primary-green/20 bg-card-bg p-6 sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -top-16 -left-16 -z-10 size-64 rounded-full bg-primary-green/10 blur-3xl" />
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
          <div aria-hidden="true" className="flex h-24 w-20 shrink-0 -rotate-6 flex-col items-center justify-center gap-3 rounded-3xl border border-approve/20 bg-primary-green/5 text-approve sm:h-28 sm:w-24">
            <CodeIcon className="size-11 stroke-1" />
            <span className="font-mono text-xs">BUILD / SHARE</span>
          </div>
        </div>
        <p className="max-w-lg text-sm leading-8 text-text-muted">
          پروژه‌های آیوهوش و دست‌ساخته‌های دانشجویان را ببینید و برای ایدهٔ
          بعدی‌تان الهام بگیرید. پروژهٔ خودتان را هم ثبت کنید تا بقیه ببینند.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/5 pt-4">
          <Link
            href="/dashboard/projects/new"
            className={`rounded-full bg-primary-green px-4 py-2.5 text-sm font-bold text-black hover:bg-primary-green-hover ${focusClasses}`}
          >
            ثبت پروژهٔ من
          </Link>
          <Link
            href="/dashboard/projects/mine"
            className={`rounded-full border border-white/10 px-4 py-2.5 text-sm hover:bg-element-bg ${focusClasses}`}
          >
            پروژه‌های من
          </Link>
        </div>
      </header>

      <section className="grid gap-3.5" aria-label="جست‌وجو و دسته‌بندی پروژه‌ها">
        <div className="flex gap-1 rounded-2xl border border-white/5 bg-card-bg p-1" role="group" aria-label="دسته‌بندی اصلی">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={kind === item.id}
              onClick={() => selectKind(item.id)}
              className={`flex min-h-12 flex-1 cursor-pointer flex-wrap items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs motion-safe:transition-colors motion-safe:duration-200 ${focusClasses} ${kind === item.id ? "bg-primary-green font-bold text-emerald-950" : "bg-transparent text-text-muted"}`}
            >
              {item.label}
              {data && (
                <span className={`min-w-5 rounded-md px-1.5 py-0.5 text-xs ${kind === item.id ? "bg-emerald-950/10" : "bg-white/5"}`}>
                  {data.counts[item.id].toLocaleString("fa-IR")}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <label htmlFor={searchId} className="flex min-h-12 items-center gap-2.5 rounded-2xl border border-white/10 bg-card-bg/50 px-4 text-text-muted">
            <SearchIcon />
            <span className="sr-only">جست‌وجو در عنوان، فناوری، دوره یا نام سازنده</span>
            <input
              id={searchId}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="نام پروژه، فناوری یا سازنده…"
              maxLength={100}
              className="w-full min-w-0 border-0 bg-transparent py-3 text-sm text-text-primary placeholder:text-text-muted/80 focus:outline-none"
            />
          </label>

          {data && data.technologies.length > 0 && (
            <>
              <label htmlFor={technologyId} className="sr-only">فیلتر فناوری</label>
              <select
                id={technologyId}
                value={technology}
                onChange={(event) => {
                  setTechnology(event.target.value);
                  setPage(1);
                }}
                className={`min-h-12 rounded-2xl border border-white/10 bg-card-bg px-4 text-sm ${focusClasses}`}
              >
                <option value="">همهٔ فناوری‌ها</option>
                {data.technologies.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="projects-list-heading" aria-busy={loading}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 id="projects-list-heading" className="text-lg font-bold">
              {kind === "student" ? "ساخته‌های دانشجویان" : "از کارگاه آیوهوش"}
            </h2>
            <p className="mt-1 text-xs leading-6 text-text-muted">
              {kind === "student" ? "هر پروژه، روایت یک مسیر یادگیری." : "برای دیدن، بررسی‌کردن و یادگرفتن."}
            </p>
          </div>
          {data && (
            <span role="status" className="text-xs whitespace-nowrap text-text-muted">
              {data.total.toLocaleString("fa-IR")} پروژه
            </span>
          )}
        </div>

        {error ? (
          <p role="alert" className="rounded-3xl bg-card-bg p-6 text-sm text-text-muted">{error}</p>
        ) : !data ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => (
              <li key={item} className="h-80 animate-pulse rounded-3xl bg-card-bg" />
            ))}
          </ul>
        ) : projects.length ? (
          <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${loading ? "opacity-60" : ""}`}>
            {projects.map((project) => (
              <li key={project.id} className="min-w-0">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 px-5 py-9 text-center text-text-muted">
            <SearchIcon className="mx-auto mb-3 size-5" />
            <h3 className="text-base text-text-primary">
              {query || technology ? "پروژه‌ای پیدا نشد" : "هنوز پروژه‌ای در این دسته نیست"}
            </h3>
            <p className="my-2 text-xs leading-6">
              {query || technology
                ? "عنوان، نام سازنده یا فناوری دیگری را جست‌وجو کنید."
                : "پروژه‌های منتشرشده در این بخش نمایش داده می‌شوند."}
            </p>
            {(query || technology) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setTechnology("");
                }}
                className={`cursor-pointer rounded-xl border-0 bg-element-bg px-4 py-2.5 text-approve ${focusClasses}`}
              >
                پاک کردن جست‌وجو
              </button>
            )}
          </div>
        )}

        {data && data.pageCount > 1 && (
          <nav className="mt-6 flex items-center justify-center gap-3" aria-label="صفحه‌بندی">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((value) => value - 1)}
              className={`rounded-xl bg-element-bg px-4 py-2 text-sm disabled:opacity-40 ${focusClasses}`}
            >
              قبلی
            </button>
            <span className="text-xs text-text-muted">
              صفحهٔ {data.page.toLocaleString("fa-IR")} از {data.pageCount.toLocaleString("fa-IR")}
            </span>
            <button
              type="button"
              disabled={page >= data.pageCount || loading}
              onClick={() => setPage((value) => value + 1)}
              className={`rounded-xl bg-element-bg px-4 py-2 text-sm disabled:opacity-40 ${focusClasses}`}
            >
              بعدی
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
