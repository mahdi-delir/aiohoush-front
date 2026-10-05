"use client";

import { useEffect, useState } from "react";

type PaymentResult = "paid" | "failed" | "pending";

const messages: Record<PaymentResult, { title: string; text: string; className: string }> = {
  paid: {
    title: "کیف پول شما شارژ شد",
    text: "مبلغ پرداختی به موجودی کیف پول اضافه شد.",
    className: "border-primary-green/30 bg-approve-bg text-approve",
  },
  failed: {
    title: "پرداخت ناموفق بود",
    text: "اگر مبلغی از حساب شما کم شده، طی ۷۲ ساعت به حسابتان برمی‌گردد.",
    className: "border-danger/30 bg-danger-bg text-danger",
  },
  pending: {
    title: "وضعیت پرداخت هنوز مشخص نیست",
    text: "اگر مبلغ از حساب شما کم شده و موجودی تغییر نکرده، با پشتیبانی تماس بگیرید.",
    className: "border-white/10 bg-element-bg text-white",
  },
};

function isPaymentResult(value: string | null): value is PaymentResult {
  return value === "paid" || value === "failed" || value === "pending";
}

// بعد از بازگشت از درگاه، بک‌اند با ?payment=... به این صفحه برمی‌گرداند.
export default function WalletPaymentResult() {
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("payment");
    if (!isPaymentResult(value)) return;
    setResult(value);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (!result) return null;

  const message = messages[result];

  return (
    <section role="status" className={`rounded-square border px-5 py-4 ${message.className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold">{message.title}</h2>
          <p className="mt-2 text-sm leading-7 opacity-90">{message.text}</p>
        </div>
        <button
          type="button"
          onClick={() => setResult(null)}
          aria-label="بستن"
          className="text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </section>
  );
}
