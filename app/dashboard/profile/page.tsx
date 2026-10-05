"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Input from "@/components/ui/text-input";
import { normalizeDigits } from "@/lib/auth-input";
import Button from "@/components/ui/button";
import StatusBar from "@/components/ui/status-bar";

type Profile = {
  id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string | null;
  national_id: string | null;
  address: string | null;
  bio: string | null;
  is_profile_completed: boolean;
};
type Picture = { id: number; url: string; created_at: string };

function errorText(data: unknown) {
  if (!data || typeof data !== "object") return "عملیات انجام نشد.";
  const message = (data as { message?: unknown }).message;
  if (typeof message === "string" && message) return message;
  return Object.values(data as Record<string, unknown>)
    .flat()
    .join(" ");
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/profile"), fetch("/api/profile/pictures")])
      .then(async ([p, pics]) => {
        const profileData = await p.json();
        const pictureData = await pics.json();
        if (!p.ok) throw new Error(errorText(profileData));
        setProfile(profileData);
        setPictures(Array.isArray(pictureData) ? pictureData : []);
      })
      .catch((e) => setError(e.message));
  }, []);

  function change(key: keyof Profile, value: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      [key]:
        key === "national_id"
          ? normalizeDigits(value).replace(/\D/g, "")
          : value,
    });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;
    setBusy(true);
    setMessage("");
    setError("");
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: profile.first_name.trim(),
        last_name: profile.last_name.trim(),
        national_id: normalizeDigits(profile.national_id || ""),
        email: profile.email || "",
        address: profile.address || "",
        bio: profile.bio || "",
      }),
    });
    const data = await response.json();
    response.ok && data?.success !== false
      ? (setProfile(data), setMessage("پروفایل ذخیره شد."))
      : setError(errorText(data));
    setBusy(false);
  }

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const form = new FormData();
    form.append("picture", file);

    const xhr = new XMLHttpRequest();

    setUploading(true);
    setUploadProgress(0);
    setError("");
    setMessage("");

    xhr.open("POST", "/api/profile/pictures");

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;

      setUploadProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      let data: any = {};

      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      } catch {
        data = {
          detail: "پاسخ نامعتبر از سرور دریافت شد.",
        };
      }

      // خطای قابل‌پیش‌بینی با HTTP 200 و success=false می‌آید.
      if (xhr.status >= 200 && xhr.status < 300 && data?.success !== false) {
        setPictures((items) => [data, ...items]);
        setUploadProgress(100);
        setMessage("تصویر با موفقیت آپلود شد.");
      } else {
        setError(errorText(data));
      }

      setUploading(false);
      event.target.value = "";
    };

    xhr.onerror = () => {
      setError("آپلود تصویر با خطا مواجه شد.");
      setUploading(false);
      event.target.value = "";
    };

    xhr.send(form);
  }

  async function remove(id: number) {
    const response = await fetch(`/api/profile/pictures/${id}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.success !== false)
      setPictures((items) => items.filter((item) => item.id !== id));
    else setError(errorText(data));
  }

  if (!profile)
    return (
      <main dir="rtl" className="p-8">
        {error || "در حال دریافت پروفایل..."}
      </main>
    );
  const name =
    `${profile.first_name} ${profile.last_name}`.trim() || "کاربر آیوهوش";

  return (
    <main dir="rtl" className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <header className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#171b4d] via-[#252b78] to-[#6d4aff] p-7 text-white shadow-xl">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-3xl font-bold">
            {name[0]}
          </div>
          <div>
            <p className="text-sm text-white/60">پروفایل کاربری</p>
            <h1 className="mt-1 text-2xl font-bold">{name}</h1>
            <p className="mt-1 text-sm text-white/70" dir="ltr">
              {profile.mobile}
            </p>
          </div>
        </div>
      </header>
      {message && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</p>
      )}
      <section className="rounded-[2rem] bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <label
            className={`rounded-icon bg-primary px-4 py-3 text-sm font-medium text-white ${
              uploading ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >
            {uploading ? "در حال آپلود..." : "افزودن تصویر"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={upload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {uploading && (
          <div className="mt-4 space-y-2">
            <StatusBar
              percent={uploadProgress}
              label="پیشرفت آپلود تصویر پروفایل"
            />

            <p className="text-xs text-text-muted">
              {uploadProgress === null
                ? "در حال شروع آپلود..."
                : `${uploadProgress.toLocaleString("fa-IR")}٪ آپلود شده`}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {pictures.map((picture) => (
            <div
              key={picture.id}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img
                src={picture.url}
                alt="تصویر پروفایل"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(picture.id)}
                className="absolute bottom-2 left-2 rounded-lg bg-black/65 px-3 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                حذف
              </button>
            </div>
          ))}
          {pictures.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              هنوز تصویری آپلود نکرده‌ای.
            </p>
          )}
        </div>
      </section>
      <section className="rounded-[2rem] bg-card p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">اطلاعات حساب</h2>
        <form onSubmit={save} className="grid gap-5 md:grid-cols-2">
          <Input
            value={profile.first_name ?? ""}
            onChange={(e) => change("first_name", e.target.value)}
            placeholder="نام"
            required
          />

          <Input
            value={profile.last_name ?? ""}
            onChange={(e) => change("last_name", e.target.value)}
            placeholder="نام خانوادگی"
            required
          />

          <Input
            value={profile.mobile ?? ""}
            readOnly
            disabled
            dir="ltr"
            className="cursor-not-allowed opacity-60"
            placeholder="شماره موبایل"
          />
          <Input
            value={profile.national_id || ""}
            onChange={(e) => change("national_id", e.target.value)}
            inputMode="numeric"
            maxLength={10}
            placeholder="کد ملی"
          />
          <Input
            value={profile.email || ""}
            onChange={(e) => change("email", e.target.value)}
            type="email"
            placeholder="ایمیل"
          />
          <textarea
            value={profile.bio || ""}
            onChange={(e) => change("bio", e.target.value)}
            maxLength={200}
            placeholder="بیوگرافی کوتاه"
            className="min-h-12 rounded-icon bg-card-bg px-4 py-3 outline-none focus:ring-2 focus:ring-primary md:col-span-2"
          />
          <textarea
            value={profile.address || ""}
            onChange={(e) => change("address", e.target.value)}
            placeholder="آدرس"
            className="min-h-24 rounded-icon bg-card-bg px-4 py-3 outline-none focus:ring-2 focus:ring-primary md:col-span-2"
          />
          <Button disabled={busy} className="">
            {busy ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </form>
      </section>
    </main>
  );
}
