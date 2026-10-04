"use client";

import { FormEvent, useEffect, useState } from "react";

type Profile = {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  national_id: string;
  address: string;
  email: string | null;
  date_joined: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "خطا در دریافت اطلاعات");
        }

        setProfile(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) return;

    setSaving(true);
    setMessage("");
    setError("");

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: profile.first_name,
        last_name: profile.last_name,
        national_id: profile.national_id,
        address: profile.address,
        email: profile.email || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        typeof data === "object"
          ? Object.values(data).flat().join(" ")
          : "ذخیره اطلاعات انجام نشد",
      );
    } else {
      setProfile(data);
      setMessage("اطلاعات پروفایل با موفقیت ذخیره شد.");
    }

    setSaving(false);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (passwords.new_password !== passwords.new_password_confirm) {
      setError("تکرار رمز عبور جدید صحیح نیست.");
      return;
    }

    const response = await fetch("/api/profile/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwords),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        typeof data === "object"
          ? Object.values(data).flat().join(" ")
          : "تغییر رمز عبور انجام نشد",
      );
      return;
    }

    setPasswords({
      old_password: "",
      new_password: "",
      new_password_confirm: "",
    });

    setMessage("رمز عبور با موفقیت تغییر کرد.");
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        در حال دریافت اطلاعات پروفایل...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-red-500">
        {error || "اطلاعات پروفایل پیدا نشد."}
      </div>
    );
  }

  const fullName =
    `${profile.first_name} ${profile.last_name}`.trim() || "کاربر آیوهوش";

  return (
    <main dir="rtl" className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-6 text-white shadow-xl md:p-8">
        <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 right-10 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur">
            {fullName.charAt(0)}
          </div>

          <div>
            <p className="mb-1 text-sm text-white/70">پروفایل کاربری</p>
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="mt-1 text-sm text-white/75">
              {profile.phone_number}
            </p>
          </div>
        </div>
      </section>

      {message && (
        <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold">اطلاعات شخصی</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            اطلاعات حساب خود را به‌روزرسانی کنید.
          </p>
        </div>

        <form onSubmit={saveProfile} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium">نام</span>
            <input
              value={profile.first_name}
              onChange={(e) =>
                setProfile({ ...profile, first_name: e.target.value })
              }
              className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">نام خانوادگی</span>
            <input
              value={profile.last_name}
              onChange={(e) =>
                setProfile({ ...profile, last_name: e.target.value })
              }
              className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">شماره موبایل</span>
            <input
              value={profile.phone_number}
              disabled
              className="h-12 w-full cursor-not-allowed rounded-xl border bg-muted px-4 text-muted-foreground"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">کد ملی</span>
            <input
              value={profile.national_id}
              onChange={(e) =>
                setProfile({ ...profile, national_id: e.target.value })
              }
              maxLength={10}
              className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary"
              required
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">ایمیل</span>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="h-12 w-full rounded-xl border bg-background px-4 outline-none transition focus:border-primary"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium">آدرس</span>
            <textarea
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              rows={4}
              className="w-full resize-none rounded-xl border bg-background px-4 py-3 outline-none transition focus:border-primary"
              required
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-xl bg-primary px-7 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm md:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold">امنیت حساب</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            برای امنیت بیشتر، رمز عبور خود را مدیریت کنید.
          </p>
        </div>

        <form onSubmit={changePassword} className="grid gap-5 md:grid-cols-3">
          <input
            type="password"
            placeholder="رمز عبور فعلی"
            value={passwords.old_password}
            onChange={(e) =>
              setPasswords({ ...passwords, old_password: e.target.value })
            }
            className="h-12 rounded-xl border bg-background px-4 outline-none focus:border-primary"
            required
          />

          <input
            type="password"
            placeholder="رمز عبور جدید"
            value={passwords.new_password}
            onChange={(e) =>
              setPasswords({ ...passwords, new_password: e.target.value })
            }
            className="h-12 rounded-xl border bg-background px-4 outline-none focus:border-primary"
            required
          />

          <input
            type="password"
            placeholder="تکرار رمز عبور جدید"
            value={passwords.new_password_confirm}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                new_password_confirm: e.target.value,
              })
            }
            className="h-12 rounded-xl border bg-background px-4 outline-none focus:border-primary"
            required
          />

          <div className="md:col-span-3">
            <button
              type="submit"
              className="h-12 rounded-xl border border-primary px-7 font-medium text-primary transition hover:bg-primary/10"
            >
              تغییر رمز عبور
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}