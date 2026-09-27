import type { Metadata } from "next";
import { getBalance } from "@/features/api/get-balance";
import { getTransactions } from "@/features/api/get-transactions";
import WalletActions from "@/components/dash/wallet/wallet-actions";
import WalletTransactions from "@/components/dash/wallet/wallet-transactions";
import {
  formatWalletAmount,
  getWalletCurrency,
} from "@/components/dash/wallet/wallet-format";

export const metadata: Metadata = {
  title: "کیف پول | آیوهوش",
};

export default async function WalletPage() {
  const [balanceResult, transactionsResult] = await Promise.allSettled([
    getBalance(),
    getTransactions(),
  ]);
  const wallet =
    balanceResult.status === "fulfilled" && balanceResult.value.success
      ? balanceResult.value.data
      : null;
  const transactions =
    transactionsResult.status === "fulfilled" &&
    transactionsResult.value.success
      ? transactionsResult.value.data
      : null;

  return (
    <div className="space-y-5 px-2 pt-3 pb-10 text-text-primary">
      <h1 className="sr-only">کیف پول</h1>
      <section
        aria-labelledby="wallet-balance-title"
        className="rounded-square bg-card-bg p-6"
      >
        <h2 id="wallet-balance-title" className="text-sm text-text-muted">
          موجودی کیف پول شما
        </h2>
        {wallet ? (
          <p className="mt-2 flex flex-wrap items-baseline gap-2 text-primary-green">
            <bdi className="text-3xl leading-relaxed font-extrabold tabular-nums sm:text-4xl">
              {formatWalletAmount(wallet.balance)}
            </bdi>
            <span className="text-2xl font-extrabold">
              {getWalletCurrency(wallet.currency)}
            </span>
          </p>
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
        {wallet && transactions ? (
          <WalletTransactions
            transactions={transactions}
            currency={wallet.currency}
          />
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
