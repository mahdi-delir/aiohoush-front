"use client";

import Image from "next/image";
import Link from "next/link";

import Bell from "@/assets/puffy-icons/bell.svg";
import { useUnreadCount } from "@/features/announcements/use-unread-count";

export default function NotificationBell() {
  const { data: unread = 0 } = useUnreadCount();
  const label = unread > 99 ? "۹۹+" : unread.toLocaleString("fa-IR");

  return (
    <Link
      href="/dashboard/notifications"
      aria-label={unread ? `اعلان‌ها، ${unread.toLocaleString("fa-IR")} خوانده‌نشده` : "اعلان‌ها"}
      className="relative inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
    >
      <Image src={Bell} alt="" width={28} height={28} />
      {unread > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] leading-none font-bold text-white ring-2 ring-black motion-safe:animate-[splash-in_300ms_ease-out]"
        >
          {label}
        </span>
      )}
    </Link>
  );
}
