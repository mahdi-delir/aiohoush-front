"use client";
import LiquidBg from "@/components/ui/liquid-bg";
import { useMe } from "@/features/hooks/use-me";
import Image from "next/image";
import Book from "@/assets/puffy-icons/book.svg";
import StatusBar from "@/components/ui/status-bar";
import Button from "@/components/ui/button";

export default function Hero() {
  const { data: me, isPending, isError } = useMe();
  return (
    <section className="min-h-44 overflow-hidden rounded-square bg-card-bg">
      {me?.user_data?.has_course ? (
        <div className="flex flex-col p-4 gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <h3 className="text-primary-green">دوره فعال شما</h3>
              <h2 className="text-xl font-semibold text-white">
                {me?.user_data?.active_courses?.[0]?.title ??
                  "شما دوره فعالی ندارید"}
              </h2>
            </div>

            <div className="">
              <LiquidBg className="p-4 rounded-full [corner-shape:circle]">
                <Image src={Book} width={40} height={40} alt="Book" />
              </LiquidBg>
            </div>
          </div>

          <div className="">
            <div className="flex justify-between">
              <div className="text-text-muted">
                <span>درس </span>
                <span>
                  {me?.user_data?.active_courses?.[0]?.current_session}
                </span>
                <span> از </span>
                <span>{me?.user_data?.active_courses?.[0]?.all_sessions}</span>
              </div>

              <div className="text-primary-green">
                <span>
                  {me?.user_data?.active_courses?.[0]?.compleated_percent}% کامل
                  شده
                </span>
              </div>
            </div>

            <StatusBar
              percent={
                me?.user_data?.active_courses?.[0]?.compleated_percent ?? 0
              }
            />
          </div>

          <div className="">
            <Button>ادامه یادگیری</Button>
          </div>
        </div>
      ) : me?.user_data?.watched_gift ? (
        <div className="">
          <h2>اینجا قراره پری عکس بده</h2>
          <p>عکس برای کسانی که هدیه رو دیدن ولی دوره ای نخریدن</p>
        </div>
      ) : (
        <div className="bg-linear-to-t from-primary-green to-transparent min-h-44 p-4">
          <h2 className="font-bold text-primary-green text-2xl">
            اینجا قراره عکس بده پری
          </h2>
          <p>عکس برای کسانی که هدیه رو ندیدن پس باید کاری کنیم برن ببینن</p>
        </div>
      )}
    </section>
  );
}
