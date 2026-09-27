import Link from "next/link";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative isolate flex min-h-dvh w-full items-center justify-center overflow-hidden bg-card-bg px-5 py-12 font-sans text-text-primary"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary-green/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div
          className="
            absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full border
            border-white/5 sm:size-128
          "
        />
        <div
          className="
            absolute top-1/2 left-1/2 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full border
            border-white/5 sm:size-160
          "
        />
      </div>

      <div className="w-full max-w-lg text-center">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-green/20 bg-approve-bg/60 px-5 py-2 text-sm font-bold text-approve focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve"
        >
          <span aria-hidden="true" className="size-2 rounded-full bg-approve" />
          آیوهوش
        </Link>

        <div
          aria-hidden="true"
          dir="ltr"
          className="relative mx-auto mt-10 mb-8 flex w-fit items-center justify-center gap-3 sm:gap-5"
        >
          <span className="text-8xl leading-none font-black text-text-primary sm:text-9xl">
            4
          </span>
          <div
            className="
              relative grid size-24 place-items-center rounded-full border border-primary-green/30
              bg-linear-to-br from-approve-bg to-element-bg shadow-2xl shadow-primary-green/10 sm:size-32
            "
          >
            <div className="absolute inset-2 rounded-full border border-approve/15" />
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="size-14 -rotate-12 text-approve sm:size-20"
            >
              <circle
                cx="32"
                cy="32"
                r="25"
                stroke="currentColor"
                strokeOpacity=".25"
              />
              <path
                d="m42 20-6 16-16 8 8-18 14-6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="m42 20-10 12-4-6 14-6Z" fill="currentColor" />
              <circle cx="32" cy="32" r="3" fill="currentColor" />
            </svg>
            <span className="absolute -top-1 right-3 size-3 rounded-full bg-approve ring-4 ring-card-bg" />
          </div>
          <span className="text-8xl leading-none font-black text-text-primary sm:text-9xl">
            4
          </span>
        </div>

        <p className="mb-3 text-xs font-medium text-approve">خطای ۴۰۴</p>
        <h1 className="text-2xl leading-normal font-bold sm:text-3xl">
          این صفحه پیدا نشد
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-8 text-text-muted">
          ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه دیگر در دسترس
          نباشد. مسیر یادگیری هنوز ادامه دارد.
        </p>

        <nav
          aria-label="مسیرهای بازگشت"
          className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-primary-green px-6 py-3 text-sm font-bold text-black hover:bg-primary-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve motion-safe:transition-colors"
          >
            بازگشت به صفحهٔ اصلی
            <span aria-hidden="true">←</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-element-bg/50 px-6 py-3 text-sm font-medium hover:border-primary-green/40 hover:bg-element-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-approve motion-safe:transition-colors"
          >
            ورود به داشبورد
          </Link>
        </nav>

        <p className="mt-10 text-xs leading-6 text-text-muted">
          آیوهوش؛ همراه قدم بعدی تو
        </p>
      </div>
    </main>
  );
}
