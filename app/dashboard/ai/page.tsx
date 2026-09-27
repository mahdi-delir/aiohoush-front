import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اکانت‌های هوش مصنوعی | آیوهوش",
  description: "بخش اکانت‌های هوش مصنوعی آیوهوش؛ به‌زودی.",
};

const services = [
  { name: "ChatGPT", initial: "G", accent: "bg-emerald-400/10 text-emerald-300" },
  { name: "Claude", initial: "C", accent: "bg-orange-300/10 text-orange-200" },
  { name: "PixVerse", initial: "P", accent: "bg-violet-400/10 text-violet-300" },
] as const;

export default function AI() {
  return (
    <div className="flex flex-col gap-6 pb-8 text-text-primary">
      <section
        aria-labelledby="ai-heading"
        className="relative isolate overflow-hidden rounded-square border border-primary-green/20 bg-card-bg px-5 py-8 sm:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 -z-10 size-56 rounded-full bg-primary-green/10 blur-3xl"
        />
        <div className="mb-7 flex items-center justify-between gap-4">
          <span className="rounded-full border border-primary-green/20 bg-approve-bg px-3 py-1.5 text-xs font-medium text-approve">
            به‌زودی در آیوهوش
          </span>
          <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-element-bg text-approve">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" />
              <path d="M20 2v4m-2-2h4" />
            </svg>
          </span>
        </div>

        <p className="mb-2 text-sm text-approve">ابزارهای بیشتر، فرصت‌های بیشتر</p>
        <h1 id="ai-heading" className="text-2xl font-bold leading-relaxed sm:text-3xl">
          اکانت‌های هوش مصنوعی
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-8 text-text-muted">
          در حال آماده‌سازی این بخش هستیم تا بتوانید اکانت ابزارهای
          هوش مصنوعی موردنیازتان را از آیوهوش تهیه کنید.
          معرفی سرویس‌ها، جزئیات اشتراک و شرایط خرید، پس از راه‌اندازی
          در همین صفحه قرار می‌گیرد.
        </p>
      </section>

      <section aria-labelledby="ai-services-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 id="ai-services-heading" className="text-base font-bold">سرویس‌های پیش‌رو</h2>
          <span className="text-xs text-text-muted">در حال آماده‌سازی</span>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {services.map((service) => (
            <li key={service.name} className="flex items-center gap-4 rounded-icon border border-white/5 bg-card-bg p-4 sm:flex-col sm:items-start sm:gap-5">
              <span aria-hidden="true" className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold ${service.accent}`}>
                {service.initial}
              </span>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold"><bdi>{service.name}</bdi></h3>
                <p className="text-xs text-text-muted">به‌زودی</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="rounded-icon border border-dashed border-white/15 px-5 py-4">
        <p className="text-sm font-medium">خرید هنوز فعال نشده است</p>
        <p className="mt-2 text-sm leading-7 text-text-muted">
          پس از راه‌اندازی، می‌توانید سرویس‌ها و شرایط ارائهٔ آن‌ها را
          بررسی کنید و گزینهٔ مناسب خودتان را انتخاب کنید.
        </p>
      </aside>
    </div>
  );
}
