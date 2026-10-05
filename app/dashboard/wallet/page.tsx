import type { Metadata } from "next";
import { getWallet } from "@/features/api/get-wallet";
import WalletActions from "@/components/dash/wallet/wallet-actions";
import WalletTransactions from "@/components/dash/wallet/wallet-transactions";
import WalletPaymentResult from "@/components/dash/wallet/wallet-payment-result";
import {
  formatWalletAmount,
  WALLET_CURRENCY_LABEL,
} from "@/components/dash/wallet/wallet-format";

export const metadata: Metadata = {
  title: "کیف پول | آیوهوش",
};

export default async function WalletPage() {
  const [result] = await Promise.allSettled([getWallet()]);

  const wallet =
    result.status === "fulfilled" && result.value?.success
      ? result.value.data ?? null
      : null;

  const isNegative = !!wallet && wallet.balance < 0;

  return (
    <div className="space-y-5 px-2 pt-3 pb-10 text-text-primary">
      <h1 className="sr-only">کیف پول</h1>
      <WalletPaymentResult />
      <section
        aria-labelledby="wallet-balance-title"
        className="rounded-square bg-card-bg p-6"
      >
        <h2 id="wallet-balance-title" className="text-sm text-text-muted">
          موجودی کیف پول شما
        </h2>
        {wallet ? (
          <>
            <p
              className={`mt-2 flex flex-wrap items-baseline gap-2 ${
                isNegative ? "text-danger" : "text-primary-green"
              }`}
            >
              <bdi
                dir="ltr"
                className="text-3xl leading-relaxed font-extrabold tabular-nums sm:text-4xl"
              >
                {isNegative ? "−" : ""}
                {formatWalletAmount(wallet.balance)}
              </bdi>
              <span className="text-2xl font-extrabold">
                {WALLET_CURRENCY_LABEL}
              </span>
            </p>
            {isNegative && (
              <p className="mt-1 text-xs leading-6 text-danger">
                حساب شما بدهکار است.
              </p>
            )}
            {wallet.pending_deposits > 0 && (
              <p className="mt-1 text-xs leading-6 text-amber-300">
                {formatWalletAmount(wallet.pending_deposits)}{" "}
                {WALLET_CURRENCY_LABEL} واریزی در انتظار تأیید حسابداری است.
              </p>
            )}
          </>
        ) : (
          <p role="status" className="mt-4 text-sm leading-7 text-text-muted">
            دریافت موجودی ممکن نشد؛ لطفاً صفحه را دوباره بارگذاری کنید.
          </p>
        )}
        <WalletActions disabled={!wallet} />
      </section>

      <section aria-labelledby="wallet-transactions-title">
        <h2 id="wallet-transactions-title" className="mb-4 text-base font-bold">
          تراکنش‌های اخیر
        </h2>
        {wallet ? (
          <WalletTransactions transactions={wallet.transactions} />
        ) : (
          <p
            role="status"
            className="rounded-icon bg-card-bg p-5 text-sm leading-7 text-text-muted"
          >
            اطلاعات لازم برای نمایش تراکنش‌ها دریافت نشد؛ لطفاً صفحه را دوباره
            بارگذاری کنید.
          </p>
        )}
      </section>
    </div>
  );
}
