"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

import type {
  ProjectDetail,
  ProjectFileItem,
  ProjectFormValues,
  ProjectOptions,
} from "@/types/project";
import {
  IMAGE_ACCEPT,
  checkImage,
  checkZip,
  focusClasses,
  formatSize,
  projectFileUrl,
  projectRequest,
  uploadWithProgress,
} from "./project-utils";

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-element-bg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/70 focus:border-primary-green/50 focus:outline-none";

const emptyValues: ProjectFormValues = {
  title: "",
  description: "",
  course: null,
  technologies: [],
  github_url: "",
  demo_url: "",
};

interface PendingImage {
  key: string;
  file: File;
  preview: string;
}

interface Upload {
  key: string;
  name: string;
  percent: number;
  error?: string;
}

let keySeed = 0;
const nextKey = () => `k${++keySeed}`;

function FieldsSection({
  values,
  options,
  onChange,
}: {
  values: ProjectFormValues;
  options: ProjectOptions;
  onChange: (values: ProjectFormValues) => void;
}) {
  const id = useId();
  const set = <K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) =>
    onChange({ ...values, [key]: value });

  function toggleTechnology(technologyId: number) {
    set(
      "technologies",
      values.technologies.includes(technologyId)
        ? values.technologies.filter((item) => item !== technologyId)
        : [...values.technologies, technologyId],
    );
  }

  return (
    <section className="space-y-4 rounded-square bg-card-bg p-5">
      <div>
        <label htmlFor={`${id}-title`} className="mb-1.5 block text-sm font-bold">عنوان پروژه</label>
        <input
          id={`${id}-title`}
          required
          maxLength={150}
          value={values.title}
          onChange={(event) => set("title", event.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor={`${id}-description`} className="mb-1.5 block text-sm font-bold">توضیحات</label>
        <textarea
          id={`${id}-description`}
          required
          rows={7}
          maxLength={5000}
          value={values.description}
          onChange={(event) => set("description", event.target.value)}
          placeholder="پروژه چه کاری انجام می‌دهد؟ چطور ساختیدش و چه چیزی یاد گرفتید؟"
          className={`${inputClasses} leading-7`}
        />
        <p className="mt-1 text-xs text-text-muted">
          {values.description.length.toLocaleString("fa-IR")} / ۵٬۰۰۰
        </p>
      </div>

      <div>
        <label htmlFor={`${id}-course`} className="mb-1.5 block text-sm font-bold">
          دوره <span className="font-normal text-text-muted">(اختیاری)</span>
        </label>
        <select
          id={`${id}-course`}
          value={values.course ?? ""}
          onChange={(event) => set("course", event.target.value ? Number(event.target.value) : null)}
          className={inputClasses}
        >
          <option value="">بدون دوره</option>
          {options.courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
        <p className="mt-1 text-xs leading-6 text-text-muted">
          اگر پروژه مربوط به یکی از دوره‌هایتان است، انتخابش کنید تا استاد دوره هم آن را ببیند.
        </p>
      </div>

      {options.technologies.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold">فناوری‌ها</legend>
          <div className="flex flex-wrap gap-2">
            {options.technologies.map((technology) => {
              const selected = values.technologies.includes(technology.id);
              return (
                <button
                  key={technology.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTechnology(technology.id)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${selected ? "border-primary-green bg-primary-green/15 text-approve" : "border-white/10 text-text-muted hover:text-text-primary"} ${focusClasses}`}
                >
                  <bdi>{technology.title}</bdi>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-github`} className="mb-1.5 block text-sm font-bold">
            لینک GitHub <span className="font-normal text-text-muted">(اختیاری)</span>
          </label>
          <input
            id={`${id}-github`}
            type="url"
            dir="ltr"
            inputMode="url"
            placeholder="https://github.com/…"
            value={values.github_url}
            onChange={(event) => set("github_url", event.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`${id}-demo`} className="mb-1.5 block text-sm font-bold">
            لینک دمو <span className="font-normal text-text-muted">(اختیاری)</span>
          </label>
          <input
            id={`${id}-demo`}
            type="url"
            dir="ltr"
            inputMode="url"
            placeholder="https://…"
            value={values.demo_url}
            onChange={(event) => set("demo_url", event.target.value)}
            className={inputClasses}
          />
        </div>
      </div>
    </section>
  );
}

function FilePicker({
  label,
  accept,
  onFiles,
  disabled,
}: {
  label: string;
  accept: string;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={`rounded-xl border border-dashed border-primary-green/40 px-4 py-3 text-sm text-approve hover:bg-primary-green/10 disabled:opacity-50 ${focusClasses}`}
      >
        {label}
      </button>
    </>
  );
}

function UploadList({ uploads }: { uploads: Upload[] }) {
  if (!uploads.length) return null;

  return (
    <ul className="space-y-2" aria-label="آپلودها">
      {uploads.map((upload) => (
        <li key={upload.key} className="rounded-xl bg-element-bg p-3 text-xs">
          <div className="flex justify-between gap-3">
            <bdi className="wrap-anywhere">{upload.name}</bdi>
            <span className={upload.error ? "text-red-300" : "text-approve"}>
              {upload.error ? "ناموفق" : `${upload.percent.toLocaleString("fa-IR")}٪`}
            </span>
          </div>
          {upload.error ? (
            <p className="mt-1 text-red-300">{upload.error}</p>
          ) : (
            <div className="mt-2 h-1 overflow-hidden rounded bg-white/10" role="progressbar" aria-valuenow={upload.percent} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-primary-green" style={{ width: `${upload.percent}%` }} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function useOptions() {
  const [options, setOptions] = useState<ProjectOptions | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    projectRequest<ProjectOptions>("/api/projects/options", {}, "دریافت گزینه‌ها ممکن نشد.")
      .then(({ data }) => {
        if (active && data) setOptions(data);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message);
      });
    return () => {
      active = false;
    };
  }, []);

  return { options, error };
}

function appendFields(formData: FormData, values: ProjectFormValues) {
  formData.append("title", values.title.trim());
  formData.append("description", values.description.trim());
  if (values.course) formData.append("course", String(values.course));
  for (const technology of values.technologies) {
    formData.append("technologies", String(technology));
  }
  formData.append("github_url", values.github_url.trim());
  formData.append("demo_url", values.demo_url.trim());
}

async function uploadZips(
  projectId: number,
  files: File[],
  setUploads: Dispatch<SetStateAction<Upload[]>>,
  onUploaded?: (file: ProjectFileItem) => void,
) {
  let failed = 0;

  for (const file of files) {
    const key = nextKey();
    setUploads((current) => [...current, { key, name: file.name, percent: 0 }]);

    const update = (patch: Partial<Upload>) =>
      setUploads((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));

    const formData = new FormData();
    formData.append("file", file, file.name);

    try {
      const created = await uploadWithProgress<ProjectFileItem>(
        `/api/projects/${projectId}/files`,
        formData,
        (percent) => update({ percent }),
      );
      update({ percent: 100 });
      if (created) onUploaded?.(created);
    } catch (reason) {
      failed += 1;
      update({ error: reason instanceof Error ? reason.message : "آپلود ناموفق بود." });
    }
  }

  return failed;
}

export function NewProjectForm() {
  const router = useRouter();
  const { options, error: optionsError } = useOptions();

  const [values, setValues] = useState<ProjectFormValues>(emptyValues);
  const [images, setImages] = useState<PendingImage[]>([]);
  const [zips, setZips] = useState<{ key: string; file: File }[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => () => imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview)), []);

  function addImages(files: File[]) {
    const problems = files.map(checkImage).filter(Boolean);
    const valid = files.filter((file) => !checkImage(file));
    setError(problems.length ? problems.join("\n") : null);
    setImages((current) => [
      ...current,
      ...valid.map((file) => ({ key: nextKey(), file, preview: URL.createObjectURL(file) })),
    ]);
  }

  function removeImage(key: string) {
    setImages((current) => {
      const target = current.find((image) => image.key === key);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((image) => image.key !== key);
    });
  }

  function addZips(files: File[]) {
    const problems = files.map(checkZip).filter(Boolean);
    const valid = files.filter((file) => !checkZip(file));
    setError(problems.length ? problems.join("\n") : null);
    setZips((current) => [...current, ...valid.map((file) => ({ key: nextKey(), file }))]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!images.length) {
      setError("حداقل یک عکس از پروژه لازم است.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    appendFields(formData, values);
    for (const image of images) formData.append("images", image.file, image.file.name);

    try {
      const { data } = await projectRequest<{ id: number }>(
        "/api/projects/mine",
        { method: "POST", body: formData },
        "ثبت پروژه ممکن نشد.",
      );
      if (!data) throw new Error("ثبت پروژه ممکن نشد.");

      setCreatedId(data.id);
      const failed = await uploadZips(data.id, zips.map((item) => item.file), setUploads);

      if (failed === 0) {
        router.push(`/dashboard/projects/${data.id}`);
        return;
      }

      setError("پروژه ثبت شد ولی بعضی فایل‌ها آپلود نشدند. از صفحهٔ ویرایش دوباره اضافه‌شان کنید.");
      setSubmitting(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ثبت پروژه ممکن نشد.");
      setSubmitting(false);
    }
  }

  if (optionsError) {
    return <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{optionsError}</p>;
  }

  if (!options) {
    return <p role="status" className="p-6 text-sm text-text-muted">در حال آماده‌سازی فرم…</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-5 pb-10 pt-3 text-text-primary">
      <section className="rounded-square bg-card-bg p-5">
        <h1 className="text-lg font-bold">ثبت پروژهٔ جدید</h1>
        <p className="mt-1 text-xs leading-6 text-text-muted">
          پروژه بعد از تأیید در گالری پروژه‌های دانشجویان نمایش داده می‌شود.
        </p>
      </section>

      <FieldsSection values={values} options={options} onChange={setValues} />

      <section className="space-y-3 rounded-square bg-card-bg p-5" aria-labelledby="new-images-heading">
        <h2 id="new-images-heading" className="text-sm font-bold">عکس‌های پروژه</h2>
        <p className="text-xs leading-6 text-text-muted">
          حداقل یک اسکرین‌شات؛ JPG، PNG یا WEBP و هر عکس حداکثر ۳ مگابایت. اولین عکس، تصویر اصلی پروژه است.
        </p>
        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {images.map((image, index) => (
              <li key={image.key} className="relative overflow-hidden rounded-xl bg-element-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.preview} alt={`عکس ${(index + 1).toLocaleString("fa-IR")}`} className="aspect-video w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(image.key)}
                  aria-label={`حذف عکس ${(index + 1).toLocaleString("fa-IR")}`}
                  className={`absolute top-1 left-1 rounded-full bg-black/75 px-2 py-0.5 text-xs text-red-300 ${focusClasses}`}
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        )}
        <FilePicker label="افزودن عکس" accept={IMAGE_ACCEPT} onFiles={addImages} disabled={submitting} />
      </section>

      <section className="space-y-3 rounded-square bg-card-bg p-5" aria-labelledby="new-files-heading">
        <h2 id="new-files-heading" className="text-sm font-bold">
          فایل‌های پروژه <span className="font-normal text-text-muted">(اختیاری)</span>
        </h2>
        <p className="text-xs leading-6 text-text-muted">
          فقط zip و هر فایل حداکثر ۲۰ مگابایت. این فایل‌ها را فقط شما، استاد دوره و مدیریت می‌بینید.
        </p>
        {zips.length > 0 && !submitting && (
          <ul className="space-y-2">
            {zips.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3 rounded-xl bg-element-bg p-3 text-xs">
                <bdi className="wrap-anywhere">{item.file.name}</bdi>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-text-muted">{formatSize(item.file.size)}</span>
                  <button
                    type="button"
                    onClick={() => setZips((current) => current.filter((zip) => zip.key !== item.key))}
                    className={`text-red-300 ${focusClasses}`}
                  >
                    حذف
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <UploadList uploads={uploads} />
        <FilePicker label="افزودن فایل zip" accept=".zip,application/zip" onFiles={addZips} disabled={submitting} />
      </section>

      {error && (
        <p role="alert" className="rounded-xl bg-red-400/10 p-3 text-sm leading-7 whitespace-pre-line text-red-200">
          {error}
          {createdId && (
            <>
              {" "}
              <Link href={`/dashboard/projects/${createdId}/edit`} className="underline">رفتن به صفحهٔ ویرایش</Link>
            </>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || createdId !== null}
        className={`w-full rounded-full bg-primary-green px-6 py-3 text-sm font-bold text-black hover:bg-primary-green-hover disabled:opacity-50 sm:w-auto ${focusClasses}`}
      >
        {submitting ? "در حال ثبت…" : "ثبت و ارسال برای تأیید"}
      </button>
    </form>
  );
}

export function EditProjectForm({ projectId }: { projectId: string }) {
  const { options, error: optionsError } = useOptions();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [values, setValues] = useState<ProjectFormValues>(emptyValues);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    let active = true;

    projectRequest<ProjectDetail>(`/api/projects/${projectId}`, {}, "دریافت پروژه ممکن نشد.")
      .then(({ data }) => {
        if (!active || !data) return;
        if (!data.isMine) {
          setLoadError("فقط سازندهٔ پروژه می‌تواند آن را ویرایش کند.");
          return;
        }
        setProject(data);
        setValues({
          title: data.title,
          description: data.description,
          course: data.course?.id ?? null,
          technologies: data.technologies.map((item) => item.id),
          github_url: data.githubUrl ?? "",
          demo_url: data.demoUrl ?? "",
        });
      })
      .catch((reason: Error) => {
        if (active) setLoadError(reason.message);
      });

    return () => {
      active = false;
    };
  }, [projectId]);

  const notice = "تغییر ذخیره شد و پروژه دوباره برای تأیید ارسال شد.";

  function markPending() {
    setProject((current) => current && { ...current, status: "pending", statusLabel: "در انتظار تأیید", rejectionReason: null });
  }

  async function saveFields(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const { message: serverMessage } = await projectRequest(
        `/api/projects/${projectId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            title: values.title.trim(),
            description: values.description.trim(),
            github_url: values.github_url.trim(),
            demo_url: values.demo_url.trim(),
          }),
        },
        "ذخیرهٔ تغییرات ممکن نشد.",
      );
      setMessage(serverMessage || notice);
      markPending();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "ذخیرهٔ تغییرات ممکن نشد.");
    } finally {
      setSaving(false);
    }
  }

  async function addImages(files: File[]) {
    const problems = files.map(checkImage).filter(Boolean);
    setError(problems.length ? problems.join("\n") : null);
    setMessage(null);
    setBusy(true);

    for (const file of files.filter((item) => !checkImage(item))) {
      const formData = new FormData();
      formData.append("image", file, file.name);
      try {
        const { data } = await projectRequest<{ id: number; url: string }>(
          `/api/projects/${projectId}/images`,
          { method: "POST", body: formData },
          "افزودن عکس ممکن نشد.",
        );
        if (data) {
          setProject((current) => current && { ...current, images: [...current.images, data] });
          markPending();
          setMessage(notice);
        }
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "افزودن عکس ممکن نشد.");
      }
    }

    setBusy(false);
  }

  async function removeImage(imageId: number) {
    if (!window.confirm("این عکس حذف شود؟")) return;
    setBusy(true);
    setError(null);
    try {
      await projectRequest(`/api/projects/${projectId}/images/${imageId}`, { method: "DELETE" }, "حذف عکس ممکن نشد.");
      setProject((current) => current && { ...current, images: current.images.filter((image) => image.id !== imageId) });
      markPending();
      setMessage(notice);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حذف عکس ممکن نشد.");
    } finally {
      setBusy(false);
    }
  }

  async function addZips(files: File[]) {
    const problems = files.map(checkZip).filter(Boolean);
    setError(problems.length ? problems.join("\n") : null);
    setMessage(null);
    setBusy(true);

    await uploadZips(
      Number(projectId),
      files.filter((file) => !checkZip(file)),
      setUploads,
      (created) => {
        setProject((current) => current && { ...current, files: [...(current.files ?? []), created] });
        markPending();
        setMessage(notice);
      },
    );

    setBusy(false);
  }

  async function removeZip(fileId: number) {
    if (!window.confirm("این فایل حذف شود؟")) return;
    setBusy(true);
    setError(null);
    try {
      await projectRequest(`/api/projects/${projectId}/files/${fileId}`, { method: "DELETE" }, "حذف فایل ممکن نشد.");
      setProject((current) => current && { ...current, files: (current.files ?? []).filter((file) => file.id !== fileId) });
      markPending();
      setMessage(notice);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "حذف فایل ممکن نشد.");
    } finally {
      setBusy(false);
    }
  }

  const failure = loadError || optionsError;
  if (failure) {
    return <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{failure}</p>;
  }

  if (!project || !options) {
    return <p role="status" className="p-6 text-sm text-text-muted">در حال دریافت پروژه…</p>;
  }

  const courseOptions =
    project.course && !options.courses.some((course) => course.id === project.course?.id)
      ? { ...options, courses: [project.course, ...options.courses] }
      : options;

  return (
    <div className="space-y-5 pb-10 pt-3 text-text-primary">
      <section className="rounded-square bg-card-bg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold">ویرایش پروژه</h1>
          <Link href={`/dashboard/projects/${project.id}`} className={`text-sm text-approve ${focusClasses}`}>
            مشاهدهٔ پروژه
          </Link>
        </div>
        <p className="mt-1 text-xs leading-6 text-text-muted">
          هر تغییری (متن، عکس یا فایل) پروژه را دوباره برای تأیید می‌فرستد و تا تأیید، در گالری نمایش داده نمی‌شود.
        </p>
        {project.status === "rejected" && project.rejectionReason && (
          <p className="mt-3 rounded-xl bg-red-400/10 p-3 text-xs leading-6 whitespace-pre-wrap text-red-200">
            دلیل رد: {project.rejectionReason}
          </p>
        )}
      </section>

      <div role="status" aria-live="polite">
        {message && <p className="rounded-xl bg-approve-bg p-3 text-sm text-approve">{message}</p>}
      </div>
      {error && (
        <p role="alert" className="rounded-xl bg-red-400/10 p-3 text-sm leading-7 whitespace-pre-line text-red-200">{error}</p>
      )}

      <form onSubmit={saveFields} className="space-y-3">
        <FieldsSection values={values} options={courseOptions} onChange={setValues} />
        <button
          type="submit"
          disabled={saving}
          className={`rounded-full bg-primary-green px-6 py-3 text-sm font-bold text-black hover:bg-primary-green-hover disabled:opacity-50 ${focusClasses}`}
        >
          {saving ? "در حال ذخیره…" : "ذخیرهٔ متن و اطلاعات"}
        </button>
      </form>

      <section className="space-y-3 rounded-square bg-card-bg p-5" aria-labelledby="edit-images-heading">
        <h2 id="edit-images-heading" className="text-sm font-bold">عکس‌های پروژه</h2>
        <p className="text-xs leading-6 text-text-muted">حداقل یک عکس باید بماند. هر عکس حداکثر ۳ مگابایت.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {project.images.map((image, index) => (
            <li key={image.id} className="relative overflow-hidden rounded-xl bg-element-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={`عکس ${(index + 1).toLocaleString("fa-IR")}`} className="aspect-video w-full object-cover" />
              {project.images.length > 1 && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => removeImage(image.id)}
                  aria-label={`حذف عکس ${(index + 1).toLocaleString("fa-IR")}`}
                  className={`absolute top-1 left-1 rounded-full bg-black/75 px-2 py-0.5 text-xs text-red-300 disabled:opacity-50 ${focusClasses}`}
                >
                  حذف
                </button>
              )}
            </li>
          ))}
        </ul>
        <FilePicker label="افزودن عکس" accept={IMAGE_ACCEPT} onFiles={addImages} disabled={busy} />
      </section>

      <section className="space-y-3 rounded-square bg-card-bg p-5" aria-labelledby="edit-files-heading">
        <h2 id="edit-files-heading" className="text-sm font-bold">فایل‌های پروژه</h2>
        <p className="text-xs leading-6 text-text-muted">فقط zip و هر فایل حداکثر ۲۰ مگابایت.</p>
        {(project.files ?? []).length > 0 && (
          <ul className="space-y-2">
            {(project.files ?? []).map((file) => (
              <li key={file.id} className="flex items-center justify-between gap-3 rounded-xl bg-element-bg p-3 text-xs">
                <a href={projectFileUrl(file.id)} download className={`wrap-anywhere hover:text-approve ${focusClasses}`}>
                  <bdi>{file.name}</bdi>
                </a>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-text-muted">{formatSize(file.size)}</span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => removeZip(file.id)}
                    className={`text-red-300 disabled:opacity-50 ${focusClasses}`}
                  >
                    حذف
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <UploadList uploads={uploads.filter((upload) => upload.error || upload.percent < 100)} />
        <FilePicker label="افزودن فایل zip" accept=".zip,application/zip" onFiles={addZips} disabled={busy} />
      </section>
    </div>
  );
}
