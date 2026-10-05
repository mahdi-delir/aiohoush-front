"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";

import type { MessageDraft, TicketDepartment, TicketOptions } from "@/types/ticket";
import MessageComposer from "./message-composer";
import { appendDraft } from "./ticket-utils";

const departments: { id: TicketDepartment; title: string; hint: string }[] = [
  { id: "mentor", title: "منتور", hint: "سؤال‌های مسیر یادگیری و پروژه" },
  { id: "teacher", title: "استاد", hint: "سؤال دربارهٔ محتوای یک دوره" },
  { id: "finance", title: "واحد مالی", hint: "پرداخت، کیف پول و اقساط" },
  { id: "management", title: "مدیریت", hint: "پیشنهاد، انتقاد یا شکایت" },
];

export default function NewTicketForm() {
  const id = useId();
  const router = useRouter();
  const [options, setOptions] = useState<TicketOptions | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [department, setDepartment] = useState<TicketDepartment | null>(null);
  const [courseId, setCourseId] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    fetch("/api/tickets/options", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((body) => {
        if (!body?.success) throw new Error(body?.message);
        setOptions(body.data);
      })
      .catch(() => setLoadError("دریافت اطلاعات ممکن نشد؛ صفحه را دوباره بارگذاری کنید."));
  }, []);

  function isAvailable(item: TicketDepartment) {
    if (!options) return false;
    if (item === "mentor") return options.mentor !== null;
    if (item === "teacher") return options.courses.length > 0;
    return true;
  }

  function unavailableReason(item: TicketDepartment) {
    if (item === "mentor") return "هنوز منتوری برای شما تعیین نشده است";
    if (item === "teacher") return "هنوز دوره‌ای تهیه نکرده‌اید";
    return "";
  }

  async function submit(draft: MessageDraft) {
    if (!department) throw new Error("بخش مورد نظر را انتخاب کنید.");
    if (!subject.trim()) throw new Error("موضوع تیکت را وارد کنید.");
    if (department === "teacher" && !courseId) throw new Error("دوره را انتخاب کنید.");

    const formData = new FormData();
    formData.append("department", department);
    formData.append("subject", subject.trim());
    if (department === "teacher") formData.append("course", courseId);
    appendDraft(formData, draft);

    const response = await fetch("/api/tickets", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.success) {
      throw new Error(body?.message || "ثبت تیکت با خطا مواجه شد.");
    }

    router.replace(`/dashboard/tickets/${body.data.id}`);
    return true;
  }

  if (loadError) {
    return <p role="alert" className="rounded-square bg-card-bg p-6 text-sm text-text-muted">{loadError}</p>;
  }

  return (
    <div className="space-y-5 pb-10 pt-3 text-text-primary">
      <section className="rounded-square bg-card-bg p-5">
        <h1 className="text-lg font-bold">تیکت جدید</h1>

        <fieldset className="mt-5">
          <legend className="mb-3 text-sm text-text-muted">تیکت برای کدام بخش است؟</legend>
          <div className="grid grid-cols-2 gap-3">
            {departments.map((item) => {
              const available = isAvailable(item.id);
              const selected = department === item.id;

              return (
                <label
                  key={item.id}
                  className={`relative cursor-pointer rounded-2xl border p-4 ${
                    selected
                      ? "border-primary-green bg-approve-bg"
                      : "border-white/10 bg-element-bg/40"
                  } ${available ? "" : "cursor-not-allowed opacity-50"}`}
                >
                  <input
                    type="radio"
                    name={`${id}-department`}
                    value={item.id}
                    checked={selected}
                    disabled={!available}
                    onChange={() => setDepartment(item.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-bold">
                    {item.title}
                    {item.id === "mentor" && options?.mentor && (
                      <span className="font-normal text-text-muted"> · {options.mentor.name}</span>
                    )}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-text-muted">
                    {options && !available ? unavailableReason(item.id) : item.hint}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {department === "teacher" && options && (
          <div className="mt-4">
            <label htmlFor={`${id}-course`} className="mb-2 block text-sm text-text-muted">دوره</label>
            <select
              id={`${id}-course`}
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              className="h-12 w-full rounded-icon bg-element-bg px-4 text-sm"
            >
              <option value="">انتخاب دوره…</option>
              {options.courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} — {course.teacherName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor={`${id}-subject`} className="mb-2 block text-sm text-text-muted">موضوع</label>
          <input
            id={`${id}-subject`}
            value={subject}
            maxLength={150}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="مثلاً: مشکل در اجرای تمرین جلسهٔ سوم"
            className="h-12 w-full rounded-icon bg-element-bg px-4 text-sm"
          />
        </div>
      </section>

      <section className="rounded-square bg-card-bg p-5">
        <h2 className="mb-3 text-sm text-text-muted">پیام</h2>
        <MessageComposer
          submitLabel="ثبت تیکت"
          placeholder="توضیح کامل بنویسید؛ می‌توانید فایل یا پیام صوتی هم بفرستید."
          disabled={!options}
          onSubmit={submit}
        />
      </section>
    </div>
  );
}
