"use client";

import Image from "next/image";
import Link from "next/link";

import Gift from "@/assets/puffy-icons/gift.svg";
import Training from "@/assets/puffy-icons/training.svg";
import ChatBot from "@/assets/puffy-icons/chatbot.svg";
import Code from "@/assets/puffy-icons/code.svg";
import Wallet from "@/assets/puffy-icons/wallet.svg";
import UserManual from "@/assets/puffy-icons/usermanual.svg";
import Support from "@/assets/puffy-icons/support.svg";
import Apply from "@/assets/puffy-icons/apply.svg";

import LiquidBg from "@/components/ui/liquid-bg";
import MainItemsSkeleton from "../skeleton/main-items";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { useAuthorization } from "@/features/auth/hooks/use-authorization";

import { PERMISSIONS } from "@/config/permissions";

interface DashboardMenuItem {
  title: string;
  href: string;
  icon: typeof Gift;

  /*
   * اگر permission نداشته باشیم،
   * آیتم نباید تصادفی نمایش داده شود.
   */
  permission?: string;

  /*
   * نمایش برای اعضای یک گروه (مثلاً «دانشجویان»).
   */
  group?: string;

  /*
   * فقط برای آیتم‌هایی که عمداً
   * برای همه کاربران لاگین‌شده هستند.
   */
  alwaysVisible?: boolean;

  /*
   * برای قابلیت‌هایی که هنوز
   * backend آن‌ها آماده نشده.
   */
  enabled: boolean;

  order: number;
}

const menuItems: DashboardMenuItem[] = [
  {
    title: "هدیه",
    href: "/gift",
    icon: Gift,
    permission: PERMISSIONS.course.view,

    // هنوز permission واقعی Gift نداریم.
    enabled: true,

    order: 1,
  },

  {
    title: "دوره ها",
    href: "/courses",
    icon: Training,

    permission: PERMISSIONS.course.view,

    enabled: true,

    order: 2,
  },

  {
    title: "پروژه ها",
    href: "/projects",
    icon: Code,

    // هنوز permission واقعی Project نداریم.
    enabled: true,
    alwaysVisible: true,

    order: 3,
  },

  {
    title: "هوش مصنوعی",
    href: "/ai",
    icon: ChatBot,
    alwaysVisible: true,

    // هنوز permission واقعی AI نداریم.
    enabled: true,

    order: 4,
  },

  {
    title: "کیف پول",
    href: "/wallet",
    icon: Wallet,

    // کیف پول برای همهٔ نقش‌ها (دانشجو، استاد، کارمند و ...) است.
    alwaysVisible: true,
    enabled: true,

    order: 5,
  },

  {
    title: "راهنما",
    href: "/manual",
    icon: UserManual,

    /*
     * راهنما permission امنیتی نیاز ندارد.
     * هر کاربر لاگین‌شده می‌تواند ببیند.
     */
    alwaysVisible: true,
    enabled: true,

    order: 6,
  },

  {
    title: "منتور من",
    href: "/my-mentor",
    icon: Support,

    group: "دانشجویان",
    enabled: true,

    order: 7,
  },

  {
    title: "برترین منتور ها",
    href: "/best-seller",
    icon: Apply,

    // بعداً با permission واقعی ranking.
    enabled: false,

    order: 8,
  },
];

export default function MainItems() {
  const { isPending, isError } = useCurrentUser();

  const { hasPermission, isInGroup } = useAuthorization();

  if (isPending) {
    return <MainItemsSkeleton />;
  }

  if (isError) {
    return <div>خطا در دریافت اطلاعات کاربر</div>;
  }

  const visibleItems = menuItems
    .filter((item) => {
      /*
       * قابلیتی که هنوز آماده نیست
       * اصلاً نمایش داده نشود.
       */
      if (!item.enabled) {
        return false;
      }

      /*
       * آیتم عمومی برای کاربران
       * authenticated.
       */
      if (item.alwaysVisible) {
        return true;
      }

      if (item.group && isInGroup(item.group)) {
        return true;
      }

      /*
       * نبود permission به معنی
       * اجازه نیست.
       */
      if (!item.permission) {
        return false;
      }

      return hasPermission(item.permission);
    })
    .sort((a, b) => a.order - b.order);

  return (
    <section className="grid grid-cols-4 gap-4 py-12">
      {visibleItems.map((item) => (
        <div
          className="flex flex-col items-center justify-center aspect-square"
          key={item.href}
        >
          <Link
            href={`/dashboard${item.href}/`}
            className="flex flex-col items-center"
          >
            <LiquidBg className="p-4 w-fit">
              <Image src={item.icon} width={36} height={36} alt={item.title} />
            </LiquidBg>

            <span className="text-nowrap text-text-muted">{item.title}</span>
          </Link>
        </div>
      ))}
    </section>
  );
}
