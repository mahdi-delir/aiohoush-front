"use client";

import Link from "next/link";

import { useOrders } from "@/features/orders/hooks/use-orders";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return <p>در حال دریافت سفارش‌ها...</p>;
  }

  if (error) {
    return <p>دریافت سفارش‌ها با خطا مواجه شد.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">سفارش‌ها</h1>

        <Link
          href="/dashboard/orders/new"
          className="rounded-xl bg-primary-green px-4 py-2 text-black"
        >
          ثبت سفارش
        </Link>
      </div>

      {!orders?.length ? (
        <div className="rounded-2xl border border-white/10 p-4">
          سفارشی وجود ندارد.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex justify-between">
              <strong>سفارش #{order.id}</strong>

              <span>{order.status}</span>
            </div>

            <p className="mt-2 text-sm">دانشجو: {order.student}</p>

            <p className="text-sm">
              تعداد محصولات: {order.requested_products.length}
            </p>
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="text-sm underline"
            >
              مشاهده سفارش
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
