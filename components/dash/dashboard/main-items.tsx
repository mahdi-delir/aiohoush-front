"use client";

import { can } from "@/features/permissions/can";
import { PERMISSIONS } from "@/config/permissions"
import Gift from "@/assets/puffy-icons/gift.svg";
import Training from "@/assets/puffy-icons/training.svg";
import ChatBot from "@/assets/puffy-icons/chatbot.svg";
import Code from "@/assets/puffy-icons/code.svg";
import Wallet from "@/assets/puffy-icons/wallet.svg";
import UserManual from "@/assets/puffy-icons/usermanual.svg";
import Support from "@/assets/puffy-icons/support.svg";
import Apply from "@/assets/puffy-icons/apply.svg";
import Image from "next/image";
import MainItemsSkeleton from "../skeleton/main-items";
import LiquidBg from "../../ui/liquid-bg";
import Link from "next/link";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

const menuItems = [
  {
    title: "هدیه",
    href: "/gift",
    icon: Gift,
    permission: PERMISSIONS.course.view,
    order: 1,
  },
  {
    title: "دوره ها",
    href: "/courses",
    icon: Training,
    permission: PERMISSIONS.course.view,
    order: 2,
  },
  {
    title: "هوش مصنوعی",
    href: "/ai",
    icon: ChatBot,
    permission: PERMISSIONS?.ai?.view,
    order: 4,
  },
  {
    title: "پروژه ها",
    href: "/projects",
    icon: Code,
    permission: PERMISSIONS?.project?.view,
    order: 3,
  },
  {
    title: "کیف پول",
    href: "/wallet",
    icon: Wallet,
    permission: PERMISSIONS?.wallet?.view,
    order: 5,
  },
  {
    title: "راهنما",
    href: "/manual",
    icon: UserManual,
    permission: PERMISSIONS?.guide?.view,
    order: 6,
  },
  {
    title: "منتور من",
    href: "/my-mentor",
    icon: Support,
    permission: PERMISSIONS?.mentor?.view,
    order: 7,
  },
  {
    title: "برترین منتور ها",
    href: "/best-seller",
    icon: Apply,
    permission: PERMISSIONS?.rank?.view,
    order: 8,
  },
];

export default function MainItems() {
  const { data: me, isPending, isError } = useCurrentUser();

  if (isPending) {
    return <MainItemsSkeleton />;
  }

  if (isError) {
    return <div>خطا در دریافت اطلاعات کاربر</div>;
  }

  const visibleItems = menuItems.filter((item) => {
    if (!item.permission) {
      return true;
    }
    return can(me.permissions, item.permission);
  });

  return (
    <section className="grid grid-cols-4 gap-2">
      {visibleItems.map((item) => {
        return (
          <div
            className="flex flex-col items-center justify-center aspect-square"
            key={item.href}
          >
            <Link
              href={`/dashboard${item.href}/`}
              className="flex flex-col items-center"
            >
              <LiquidBg className="p-4 w-fit">
                <Image
                  src={item.icon}
                  width={36}
                  height={36}
                  alt={item.title}
                />
              </LiquidBg>

              <span className="text-nowrap text-text-muted">{item.title}</span>
            </Link>
          </div>
        );
      })}
    </section>
  );
}
