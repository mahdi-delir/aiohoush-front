"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import Book from "@/assets/puffy-icons/book.svg";
import LiquidBg from "@/components/ui/liquid-bg";
import StatusBar from "@/components/ui/status-bar";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const HERO_IMAGES: {
  giftNotWatched: StaticImageData | null;
  noActiveCourse: StaticImageData | null;
} = {
  giftNotWatched: null,
  noActiveCourse: null,
};

const ctaClasses =
  "inline-flex h-10 items-center justify-center rounded-2xl px-5 text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green";

function PromoHero({
  eyebrow,
  title,
  text,
  href,
  cta,
  image,
  tone,
}: {
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  image: StaticImageData | null;
  tone: "gift" | "courses";
}) {
  return (
    <div
      className={`relative isolate flex min-h-44 flex-col justify-end gap-3 p-5 ${
        tone === "gift"
          ? "bg-linear-to-t from-primary-green/35 via-primary-green/10 to-transparent"
          : "bg-linear-to-t from-sky-500/25 via-sky-500/5 to-transparent"
      }`}
    >
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="-z-10 object-cover opacity-60"
          priority
        />
      )}

      <span className="text-xs text-primary-green">{eyebrow}</span>
      <h2 className="text-2xl leading-10 font-bold text-white">{title}</h2>
      <p className="max-w-md text-sm leading-7 text-white/80">{text}</p>
      <div>
        <Link href={href} className={`${ctaClasses} bg-primary-green text-black hover:bg-primary-green-hover`}>
          {cta}
        </Link>
      </div>
    </div>
  );
}

export default function Hero() {
  const { data: me, isPending, isError } = useCurrentUser();

  if (isPending) {
    return <section aria-hidden="true" className="min-h-44 animate-pulse rounded-square bg-card-bg" />;
  }

  if (isError || !me) {
    return null;
  }

  const userData = me.user_data;
  const course = userData?.has_course ? userData.active_courses?.[0] : undefined;

  return (
    <section className="min-h-44 overflow-hidden rounded-square bg-card-bg">
      {course ? (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex justify-between gap-3">
            <div className="flex min-w-0 flex-col justify-center">
              <h3 className="text-primary-green">دورهٔ فعال شما</h3>
              <h2 className="text-xl font-semibold text-white wrap-anywhere">{course.title}</h2>
            </div>

            <LiquidBg className="shrink-0 self-start rounded-full p-4 [corner-shape:circle]">
              <Image src={Book} width={40} height={40} alt="" />
            </LiquidBg>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <div className="text-text-muted">
                {course.all_sessions
                  ? `${course.current_session.toLocaleString("fa-IR")} جلسه از ${course.all_sessions.toLocaleString("fa-IR")} جلسه`
                  : "هنوز جلسه‌ای منتشر نشده"}
              </div>
              <div className="text-primary-green">
                {Math.round(course.completed_percent).toLocaleString("fa-IR")}٪ کامل شده
              </div>
            </div>

            <StatusBar percent={course.completed_percent} />
          </div>

          <div>
            <Link
              href={`/dashboard/courses/${encodeURIComponent(course.slug)}`}
              className={`${ctaClasses} bg-primary-green text-black hover:bg-primary-green-hover`}
            >
              ادامهٔ یادگیری
            </Link>
          </div>
        </div>
      ) : userData?.watched_gift ? (
        <PromoHero
          tone="courses"
          eyebrow="قدم بعدی"
          title="وقتشه اولین دوره‌ات رو شروع کنی"
          text="هدیه‌ها رو دیدی؛ حالا یه دوره انتخاب کن و یادگیری رو جدی شروع کن."
          href="/dashboard/courses"
          cta="دیدن دوره‌ها"
          image={HERO_IMAGES.noActiveCourse}
        />
      ) : (
        <PromoHero
          tone="gift"
          eyebrow="هدیهٔ آیوهوش"
          title="یه هدیه منتظرته"
          text="قبل از هر چیز، ویدئوهای هدیهٔ آیوهوش رو ببین تا با دنیای برنامه‌نویسی آشنا بشی."
          href="/dashboard/gift"
          cta="دیدن هدیه‌ها"
          image={HERO_IMAGES.giftNotWatched}
        />
      )}
    </section>
  );
}
