"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { MyProject } from "@/types/project";
import ProjectCard from "./project-card";
import { focusClasses, projectRequest, statusStyles } from "./project-utils";

export default function MyProjects() {
  const [projects, setProjects] = useState<MyProject[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    projectRequest<{ projects: MyProject[] }>("/api/projects/mine", {}, "دریافت پروژه‌ها ممکن نشد.")
      .then(({ data }) => {
        if (active) setProjects(data?.projects ?? []);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-5 pb-10 pt-3 text-text-primary">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-square bg-card-bg p-5">
        <div>
          <h1 className="text-lg font-bold">پروژه‌های من</h1>
          <p className="mt-1 text-xs leading-6 text-text-muted">
            پروژه‌ها بعد از تأیید در گالری نمایش داده می‌شوند. هر ویرایش، پروژه را دوباره برای تأیید می‌فرستد.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className={`shrink-0 rounded-full bg-primary-green px-4 py-2.5 text-sm font-bold text-black hover:bg-primary-green-hover ${focusClasses}`}
        >
          ثبت پروژهٔ جدید
        </Link>
      </section>

      {error ? (
        <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{error}</p>
      ) : projects === null ? (
        <p role="status" className="p-6 text-sm text-text-muted">در حال دریافت پروژه‌ها…</p>
      ) : projects.length === 0 ? (
        <div className="rounded-square bg-card-bg px-6 py-12 text-center">
          <p className="text-sm leading-7 text-text-muted">هنوز پروژه‌ای ثبت نکرده‌اید.</p>
          <Link href="/dashboard/projects/new" className={`mt-4 inline-block text-sm text-approve ${focusClasses}`}>
            اولین پروژه‌تان را ثبت کنید
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="flex min-w-0 flex-col gap-2">
              <ProjectCard
                project={project}
                badge={
                  <span className="block rounded-full bg-black/80">
                    <span className={`block rounded-full px-2.5 py-1 text-xs ${statusStyles[project.status]}`}>
                      {project.statusLabel}
                    </span>
                  </span>
                }
              />
              {project.status === "rejected" && project.rejectionReason && (
                <p className="rounded-xl bg-red-400/10 p-3 text-xs leading-6 whitespace-pre-wrap wrap-anywhere text-red-200">
                  دلیل رد: {project.rejectionReason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
