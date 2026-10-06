"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import type { ProjectCard as ProjectCardData } from "@/types/project";
import { focusClasses } from "./project-utils";

export function ProjectCover({
  src,
  title,
  className = "aspect-video",
}: {
  src: string | null;
  title: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-element-bg ${className}`}>
      {src && !failed ? (
        // عکس از دامنهٔ API می‌آید و در remotePatterns نیست.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`تصویر پروژهٔ ${title}`}
          loading="lazy"
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="grid size-full place-items-center font-mono text-xs text-text-muted">
          PROJECT
        </span>
      )}
    </div>
  );
}

export default function ProjectCard({
  project,
  href = `/dashboard/projects/${project.id}`,
  badge,
}: {
  project: ProjectCardData;
  href?: string;
  badge?: ReactNode;
}) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-card-bg hover:border-primary-green/25 motion-safe:transition-colors motion-safe:duration-200">
      <div className="relative">
        <ProjectCover src={project.cover} title={project.title} />
        {project.imageCount > 1 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-xs text-white">
            {project.imageCount.toLocaleString("fa-IR")} عکس
          </span>
        )}
        {badge && <div className="absolute top-2 right-2">{badge}</div>}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <span className="text-xs text-approve">
          {project.kind === "student"
            ? `ساختهٔ ${project.author?.name ?? "دانشجو"}`
            : "ساختهٔ آیوهوش"}
          {project.course ? ` · ${project.course.title}` : ""}
        </span>

        <h3 className="text-base leading-7 font-bold wrap-anywhere">
          <Link
            href={href}
            className={`after:absolute after:inset-0 after:content-[''] ${focusClasses}`}
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-sm leading-7 text-text-muted wrap-anywhere">{project.summary}</p>

        {project.technologies.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="فناوری‌های پروژه">
            {project.technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-lg border border-white/5 px-2 py-1 font-mono text-xs text-slate-300"
              >
                <bdi>{technology}</bdi>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
