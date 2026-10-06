"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

/**
 * یادآوری تکمیل پروفایل؛ مسیر کاربر عوض نمی‌شود.
 * روی خود صفحهٔ پروفایل نمایش داده نمی‌شود.
 */
export default function ProfileReminder() {
  const pathname = usePathname();
  const { data: me } = useCurrentUser();

  // اگر بک‌اند هنوز این فیلد را نفرستد (undefined)، بنر نشان داده نمی‌شود.
  if (!me || me.user.is_profile_completed !== false) return null;
  if (pathname.startsWith("/dashboard/profile")) return null;

  return (
    <aside
      aria-label="تکمیل پروفایل"
      className="mx-2 flex flex-wrap items-center justify-between gap-3 rounded-icon border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm text-text-primary"
    >
      <p className="leading-7">
        پروفایلت هنوز کامل نیست. نام و نام خانوادگی‌ات را وارد کن تا منتور و
        استادها تو را بشناسند.
      </p>
      <Link
        href="/dashboard/profile"
        className="shrink-0 rounded-full bg-amber-300 px-4 py-2 text-xs font-bold text-black hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
      >
        تکمیل پروفایل
      </Link>
    </aside>
  );
}
