import type { Transaction, Wallet } from "@/types/wallet";
import { formatWalletAmount, formatWalletDate, getWalletCurrency } from "./wallet-format";

const transactionStatuses = {
  confirmed: { title: "تأیید شده", className: "sr-only" },
  pending: { title: "در انتظار تأیید", className: "text-amber-300" },
  rejected: { title: "رد شده", className: "text-red-300" },
} as const;

function TransactionRow({ transaction, currency }: {
  transaction: Transaction;
  currency: Wallet["currency"];
}) {
  const isDeposit = transaction.side === "deposit";
  const isConfirmed = transaction.status === "confirmed";
  const status = transactionStatuses[transaction.status];

  return (
    <li className="flex items-center gap-3 rounded-icon bg-card-bg p-4">
      <span
        aria-hidden="true"
        className={`grid size-10 shrink-0 place-items-center rounded-2xl bg-element-bg ${
          isDeposit && isConfirmed ? "text-primary-green" : "text-text-muted"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          {isDeposit ? (
            <path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4" />
          ) : (
            <path d="M12 15V3m-4 4 4-4 4 4M5 16v4h14v-4" />
          )}
        </svg>
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm leading-6 font-bold wrap-break-word">
          {transaction.title}
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">
          <time dateTime={transaction.date}>{formatWalletDate(transaction.date)}</time>
        </p>
        <span className={`mt-1 block text-xs ${status.className}`}>{status.title}</span>
      </div>

      <p
        className={`shrink-0 text-left text-xs leading-6 font-bold tabular-nums sm:text-sm ${
          isDeposit && isConfirmed
            ? "text-primary-green"
            : isConfirmed
              ? "text-text-primary"
              : "text-text-muted"
        }`}
      >
        <span className="sr-only">{isDeposit ? "واریز " : "برداشت "}</span>
        <bdi dir="ltr">
          {isDeposit ? "+" : "−"}{formatWalletAmount(transaction.amount)}
        </bdi>{" "}
        <span>{getWalletCurrency(currency)}</span>
      </p>
    </li>
  );
}

export default function WalletTransactions({ transactions, currency }: {
  transactions: Transaction[];
  currency: Wallet["currency"];
}) {
  const sorted = [...transactions].sort((a, b) => {
    const first = Date.parse(a.date);
    const second = Date.parse(b.date);
    return (Number.isNaN(second) ? 0 : second) - (Number.isNaN(first) ? 0 : first);
  });
  const recent = sorted.slice(0, 3);
  const remaining = sorted.slice(3);

  if (transactions.length === 0) {
    return (
      <p className="rounded-icon bg-card-bg p-6 text-center text-sm leading-7 text-text-muted">
        هنوز تراکنشی برای کیف پول شما ثبت نشده است.
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {recent.map((transaction, index) => (
          <TransactionRow
            key={`${transaction.trackId ?? transaction.date}-${index}`}
            transaction={transaction}
            currency={currency}
          />
        ))}
      </ul>
      {remaining.length > 0 && (
        <details className="mt-4">
          <summary className="
            w-fit cursor-pointer rounded-lg px-1 py-2 text-xs text-text-muted
            hover:text-approve focus-visible:outline-2
            focus-visible:outline-offset-4 focus-visible:outline-approve
          ">
            تراکنش‌های بیشتر ({formatWalletAmount(remaining.length)})
          </summary>
          <ul className="mt-3 space-y-3">
            {remaining.map((transaction, index) => (
              <TransactionRow
                key={`${transaction.trackId ?? transaction.date}-${index}`}
                transaction={transaction}
                currency={currency}
              />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
