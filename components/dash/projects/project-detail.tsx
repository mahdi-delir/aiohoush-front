"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { ProjectDetail } from "@/types/project";
import { ProjectCover } from "./project-card";
import {
  focusClasses,
  formatSize,
  projectFileUrl,
  projectRequest,
  safeLink,
  statusStyles,
} from "./project-utils";

function ImageViewer({ project }: { project: ProjectDetail }) {
  const [index, setIndex] = useState(0);
  const images = project.images;
  const current = images[Math.min(index, images.length - 1)];

  if (!current) {
    return <ProjectCover src={null} title={project.title} className="aspect-video rounded-square" />;
  }

  return (
    <section aria-label="تصاویر پروژه" className="space-y-3">
      <a
        href={current.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block overflow-hidden rounded-square bg-element-bg ${focusClasses}`}
        aria-label="نمایش تصویر در اندازهٔ کامل"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={`تصویر ${(index + 1).toLocaleString("fa-IR")} از پروژهٔ ${project.title}`}
          className="max-h-[70vh] w-full object-contain"
        />
      </a>

      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="انتخاب تصویر">
          {images.map((image, imageIndex) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(imageIndex)}
                aria-pressed={imageIndex === index}
                aria-label={`تصویر ${(imageIndex + 1).toLocaleString("fa-IR")}`}
                className={`block h-16 w-24 overflow-hidden rounded-xl border-2 ${imageIndex === index ? "border-primary-green" : "border-transparent opacity-70 hover:opacity-100"} ${focusClasses}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="size-full object-cover" loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ProjectDetailView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    projectRequest<ProjectDetail>(`/api/projects/${projectId}`, {}, "دریافت پروژه ممکن نشد.")
      .then(({ data }) => {
        if (active && data) setProject(data);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  async function remove() {
    if (!window.confirm("این پروژه حذف شود؟ این کار برگشت‌پذیر نیست.")) return;

    setDeleting(true);
    try {
      await projectRequest(`/api/projects/${projectId}`, { method: "DELETE" }, "حذف پروژه ممکن نشد.");
      router.push("/dashboard/projects/mine");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حذف پروژه ممکن نشد.");
      setDeleting(false);
    }
  }

  if (error && !project) {
    return <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{error}</p>;
  }

  if (!project) {
    return <p role="status" className="p-6 text-sm text-text-muted">در حال دریافت پروژه…</p>;
  }

  const github = safeLink(project.githubUrl, true);
  const demo = safeLink(project.demoUrl);

  return (
    <div className="space-y-5 pb-10 pt-3 text-text-primary">
      {project.isMine && project.status && (
        <section
          className={`rounded-square p-4 text-sm leading-7 ${statusStyles[project.status]}`}
          role={project.status === "rejected" ? "alert" : "status"}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-bold">وضعیت: {project.statusLabel}</p>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className={`rounded-full bg-black/30 px-4 py-1.5 text-xs text-text-primary hover:bg-black/50 ${focusClasses}`}
              >
                ویرایش
              </Link>
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className={`rounded-full bg-black/30 px-4 py-1.5 text-xs text-red-300 hover:bg-black/50 disabled:opacity-50 ${focusClasses}`}
              >
                {deleting ? "در حال حذف…" : "حذف"}
              </button>
            </div>
          </div>
          {project.status === "pending" && (
            <p className="mt-1 text-xs">بعد از تأیید، پروژه در گالری برای همه نمایش داده می‌شود.</p>
          )}
          {project.status === "rejected" && project.rejectionReason && (
            <p className="mt-1 text-xs whitespace-pre-wrap wrap-anywhere">دلیل: {project.rejectionReason}</p>
          )}
        </section>
      )}

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <ImageViewer project={project} />

      <section className="space-y-4 rounded-square bg-card-bg p-5">
        <div>
          <span className="text-xs text-approve">
            {project.kind === "student" ? "ساختهٔ دانشجو" : "ساختهٔ آیوهوش"}
            {project.course ? ` · دورهٔ ${project.course.title}` : ""}
          </span>
          <h1 className="mt-2 text-xl leading-9 font-bold wrap-anywhere">{project.title}</h1>
        </div>

        <p className="text-sm leading-8 whitespace-pre-wrap wrap-anywhere text-text-muted">
          {project.description}
        </p>

        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="فناوری‌های پروژه">
            {project.technologies.map((technology) => (
              <li key={technology.id} className="rounded-lg border border-white/5 px-2 py-1 font-mono text-xs text-slate-300">
                <bdi>{technology.title}</bdi>
              </li>
            ))}
          </ul>
        )}

        {(github || demo) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {demo && (
              <a href={demo} target="_blank" rel="noopener noreferrer" className={`rounded-xl bg-primary-green px-4 py-2.5 text-xs font-bold text-black hover:bg-primary-green-hover ${focusClasses}`}>
                مشاهدهٔ دمو
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className={`rounded-xl border border-white/10 px-4 py-2.5 text-xs hover:bg-element-bg ${focusClasses}`}>
                GitHub
              </a>
            )}
          </div>
        )}
      </section>

      {project.author && (
        <section className="flex items-start gap-3 rounded-square bg-card-bg p-5" aria-label="دربارهٔ سازندهٔ پروژه">
          {project.author.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={project.author.avatar} alt="" className="size-12 shrink-0 rounded-full object-cover" />
          ) : (
            <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-violet-300/10 text-violet-200">
              {project.author.name.slice(0, 1) || "؟"}
            </span>
          )}
          <div className="min-w-0">
            <strong className="block text-sm">{project.author.name}</strong>
            <span className="text-xs text-text-muted">دانشجوی آیوهوش</span>
            <p className="mt-2 text-xs leading-6 whitespace-pre-wrap wrap-anywhere text-text-muted">
              {project.author.bio || "معرفی کوتاهی در پروفایل ثبت نشده است."}
            </p>
          </div>
        </section>
      )}

      {project.files && project.files.length > 0 && (
        <section className="rounded-square bg-card-bg p-5" aria-labelledby="project-files-heading">
          <h2 id="project-files-heading" className="text-sm font-bold">فایل‌های پروژه</h2>
          <p className="mt-1 text-xs text-text-muted">
            این فایل‌ها فقط برای سازندهٔ پروژه، استاد دوره و مدیریت قابل دانلود است.
          </p>
          <ul className="mt-3 space-y-2">
            {project.files.map((file) => (
              <li key={file.id}>
                <a
                  href={projectFileUrl(file.id)}
                  download
                  className={`flex items-center justify-between gap-3 rounded-xl bg-element-bg p-3 text-xs hover:bg-white/10 ${focusClasses}`}
                >
                  <bdi className="wrap-anywhere">{file.name}</bdi>
                  <span className="shrink-0 text-approve">{formatSize(file.size)} · دانلود</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href="/dashboard/projects" className={`inline-block text-sm text-approve ${focusClasses}`}>
        بازگشت به پروژه‌ها
      </Link>
    </div>
  );
}
