import type { Metadata } from "next";
import Link from "next/link";
import OtpLoginForm from "@/components/auth/otp-login-form";

export const metadata: Metadata = {
  title: "ورود به آیوهوش",
  description: "ورود به حساب آیوهوش با شماره موبایل و رمز یک‌بارمصرف.",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return (
    <main
      dir="rtl"
      className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden bg-card-bg font-sans text-text-primary"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
      </div>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <Link
          href="/"
          aria-label="آیوهوش، صفحهٔ اصلی"
          className="
            inline-flex min-h-11 items-center gap-3 rounded-xl focus-visible:outline-2
            focus-visible:outline-offset-4 focus-visible:outline-approve
          "
        >
          <span
            aria-hidden="true"
            className="
              grid size-10 place-items-center rounded-2xl border border-approve/20 bg-approve-bg text-xl
              font-bold text-approve
            "
          >
            آ
          </span>
          <span className="text-xl font-bold">آیوهوش</span>
        </Link>
        <Link
          href="/"
          className="
            inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs text-text-muted
            hover:bg-element-bg hover:text-text-primary focus-visible:outline-2
            focus-visible:outline-approve
          "
        >
          بازگشت به سایت <span aria-hidden="true">←</span>
        </Link>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-5 py-8 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <div className="w-full max-w-md justify-self-center lg:justify-self-start">
          <OtpLoginForm />
          <p className="mt-5 px-4 text-center text-xs leading-6 text-text-muted">
            حساب تو، مسیر یادگیری تو.
          </p>
        </div>

        <aside
          aria-labelledby="auth-intro-heading"
          className="relative hidden lg:block"
        >
          <div
            aria-hidden="true"
            className="relative mx-auto mb-10 grid size-64 place-items-center"
          >
            <div className="absolute inset-0 rounded-full border border-primary-green/15" />
            <div className="absolute inset-7 rounded-full border border-primary-green/20" />
            <div className="absolute inset-14 rounded-full bg-primary-green/10 blur-2xl" />
            <div
              className="
                relative grid size-28 -rotate-6 place-items-center rounded-square border border-approve/30
                bg-linear-to-br from-approve-bg to-element-bg shadow-2xl shadow-primary-green/10
              "
            >
              <svg
                viewBox="0 0 48 48"
                fill="none"
                className="size-14 rotate-6 text-approve"
              >
                <path
                  d="m17 14-10 10 10 10m14-20 10 10-10 10m-4-25-6 30"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="absolute top-4 right-9 size-3 rounded-full bg-approve ring-8 ring-card-bg" />
            <span className="absolute bottom-8 left-4 size-2 rounded-full bg-amber-300 ring-8 ring-card-bg" />
            <span className="absolute top-9 -left-2 rounded-2xl border border-white/10 bg-element-bg px-4 py-2 text-xs text-approve">
              یاد بگیر
            </span>
            <span className="absolute right-0 bottom-5 rounded-2xl border border-white/10 bg-element-bg px-4 py-2 text-xs text-text-primary">
              بساز و رشد کن
            </span>
          </div>
          <p className="mb-4 text-sm text-approve">از همین‌جا شروع می‌شود</p>
          <h2
            id="auth-intro-heading"
            className="text-4xl leading-normal font-bold"
          >
            قدم بعدی تو،
            <br />
            <span className="text-approve">دنیایی از امکان‌ها.</span>
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-8 text-text-muted">
            از اولین خط کد تا پروژه‌ای که به آن افتخار می‌کنی؛ آیوهوش در مسیر
            یادگیری کنارت است.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3 text-xs text-text-muted">
            {["یادگیری کاربردی", "همراهی منتور", "ساخت پروژه"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-approve"
                />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <footer className="px-5 py-6 text-center text-xs leading-6 text-text-muted">
        آیوهوش · آموزش برنامه‌نویسی و هوش مصنوعی
      </footer>
    </main>
  );
}
