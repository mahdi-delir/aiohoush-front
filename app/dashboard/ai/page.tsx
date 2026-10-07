"use client";

import { useEffect, useState } from "react";

const products = [
  {
    code: "chatgpt-monthly",
    name: "اکانت ChatGPT",
    description:
      "دسترسی ماهانه به ابزارهای هوش مصنوعی ChatGPT برای گفتگو، تولید محتوا، ایده‌پردازی و کمک در برنامه‌نویسی.",
    price: 5_500_000,
    icon: "G",
    color: "from-emerald-400/30 to-emerald-900/20",
  },
  {
    code: "claude-monthly",
    name: "اکانت Claude",
    description:
      "اکانت ماهانه Claude برای تحلیل متن، خلاصه‌سازی، تولید محتوا و کمک در کارهای پژوهشی و برنامه‌نویسی.",
    price: 9_000_000,
    icon: "C",
    color: "from-orange-400/30 to-orange-900/20",
  },
  {
    code: "pixverse-monthly",
    name: "اکانت PixVerse",
    description:
      "اکانت ماهانه PixVerse برای ساخت ویدئوهای خلاقانه با استفاده از ابزارهای تولید ویدئوی هوش مصنوعی.",
    price: 14_000_000,
    icon: "P",
    color: "from-violet-400/30 to-violet-900/20",
  },
  {
    code: "higgsfield-monthly",
    name: "اکانت Higgsfield",
    description:
      "اکانت ماهانه Higgsfield برای ساخت ویدئو، محتوای بصری و استفاده از ابزارهای خلاقیت مبتنی بر هوش مصنوعی.",
    price: 6_000_000,
    icon: "H",
    color: "from-cyan-400/30 to-cyan-900/20",
  },
] as const;

type PaymentResult = "paid" | "failed" | "pending";

const paymentMessages: Record<
  PaymentResult,
  { title: string; text: string; className: string }
> = {
  paid: {
    title: "پرداخت با موفقیت انجام شد",
    text: "سفارش شما ثبت شد و اطلاعات اکانت به‌زودی برایتان ارسال می‌شود.",
    className: "border-primary-green/30 bg-approve-bg text-approve",
  },
  failed: {
    title: "پرداخت ناموفق بود",
    text: "اگر مبلغی از حساب شما کم شده، طی ۷۲ ساعت به حسابتان برمی‌گردد.",
    className: "border-danger/30 bg-danger-bg text-danger",
  },
  pending: {
    title: "وضعیت پرداخت هنوز مشخص نیست",
    text: "اگر مبلغ از حساب شما کم شده، با پشتیبانی تماس بگیرید و شماره سفارش را اعلام کنید.",
    className: "border-white/10 bg-element-bg text-white",
  },
};

function isPaymentResult(value: string | null): value is PaymentResult {
  return value === "paid" || value === "failed" || value === "pending";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export default function AIPage() {
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<{
    result: PaymentResult;
    orderId: string | null;
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("payment");

    if (!isPaymentResult(result)) return;

    setPaymentResult({ result, orderId: params.get("order") });
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const handlePurchase = async (productCode: string) => {
    try {
      setLoadingProduct(productCode);

      const response = await fetch("/api/ai-products/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          product_code: productCode,
        }),
      });

      const body = await response.json();

      if (!response.ok || !body.success) {
        throw new Error(body.message || "شروع پرداخت با خطا مواجه شد.");
      }

      if (!body.data?.payment_url) {
        throw new Error("آدرس پرداخت از سرور دریافت نشد.");
      }

      window.location.assign(body.data.payment_url);
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "شروع پرداخت با خطا مواجه شد.",
      );
    } finally {
      setLoadingProduct(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      {paymentResult && (
        <section
          role="status"
          className={`rounded-square border px-5 py-4 ${paymentMessages[paymentResult.result].className}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold">
                {paymentMessages[paymentResult.result].title}
              </h2>
              <p className="mt-2 text-sm leading-7 opacity-90">
                {paymentMessages[paymentResult.result].text}
              </p>
              {paymentResult.orderId && (
                <p className="mt-2 text-xs opacity-75" dir="ltr">
                  {paymentResult.orderId}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPaymentResult(null)}
              aria-label="بستن"
              className="text-lg leading-none opacity-70 hover:opacity-100"
            >
              ×
            </button>
          </div>
        </section>
      )}

      <section className="relative isolate overflow-hidden rounded-square border border-primary-green/20 bg-card-bg px-5 py-8 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 -z-10 size-56 rounded-full bg-primary-green/10 blur-3xl"
        />

        <span className="rounded-full border border-primary-green/20 bg-approve-bg px-3 py-1.5 text-xs font-medium text-approve">
          اشتراک‌های هوش مصنوعی
        </span>

        <h1 className="mt-6 text-2xl font-bold leading-relaxed sm:text-3xl">
          ابزار مناسب خودت را انتخاب کن
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-8 text-text-muted">
          اشتراک‌های ماهانهٔ ابزارهای کاربردی هوش مصنوعی را از آیوهوش تهیه کن و
          بعد از پرداخت، وضعیت سفارش و اطلاعات تحویل را از همین حساب پیگیری کن.
        </p>
      </section>

      <section aria-labelledby="ai-products-heading" className="space-y-4">
        <h2 id="ai-products-heading" className="px-1 text-base font-bold">
          محصولات موجود
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products.map((product) => {
            const isLoading = loadingProduct === product.code;

            return (
              <article
                key={product.code}
                className={`relative overflow-hidden rounded-square border border-white/10 bg-linear-to-br ${product.color} p-5`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-8 size-32 rounded-full bg-white/5 blur-2xl"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl font-bold text-white">
                      {product.icon}
                    </span>

                    <h3 className="mt-5 text-xl font-bold">{product.name}</h3>
                  </div>

                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/80">
                    ماهانه
                  </span>
                </div>

                <p className="relative mt-4 min-h-20 text-sm leading-7 text-white/75">
                  {product.description}
                </p>

                <div className="relative mt-6 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/60">قیمت اشتراک</p>

                    <p className="mt-1 text-lg font-bold text-white">
                      {formatPrice(product.price)} تومان
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={loadingProduct !== null}
                    onClick={() => handlePurchase(product.code)}
                    className="rounded-xl bg-primary-green px-4 py-2.5 text-sm font-bold text-black transition hover:bg-primary-green-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? "در حال انتقال..." : "خرید"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
