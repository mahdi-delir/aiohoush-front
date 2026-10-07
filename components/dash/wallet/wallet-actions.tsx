"use client";

import { type FormEvent, useId, useState } from "react";

import Button from "@/components/ui/button";
import { normalizeDigits } from "@/lib/auth-input";
import { WALLET_CURRENCY_LABEL } from "./wallet-format";

const buttonClassName = `
  h-12 rounded-full px-3 text-sm font-bold text-black
  shadow-lg shadow-primary-green/20
  hover:bg-primary-green-hover
  focus-visible:outline-2 focus-visible:outline-offset-4
  focus-visible:outline-approve
  disabled:cursor-not-allowed disabled:opacity-50
  motion-safe:transition-colors
`;

const amountFormatter = new Intl.NumberFormat("fa-IR");

function parseToman(value: string): number | null {
  const digits = normalizeDigits(value).replace(/[^\d]/g, "");
  if (!digits) return null;
  const amount = Number(digits);
  return Number.isSafeInteger(amount) ? amount : null;
}

export default function WalletActions({ disabled = false }: { disabled?: boolean }) {
  const messageId = useId();
  const amountId = useId();
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null);
  const [amountText, setAmountText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountToman = parseToman(amountText);

  async function startTopUp(event: FormEvent) {
    event.preventDefault();

    if (!amountToman) {
      setError("مبلغ را وارد کنید.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/wallet/top-up", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount_rial: amountToman * 10 }),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.success || !body.data?.payment_url) {
        throw new Error(body?.message || "شروع پرداخت با خطا مواجه شد.");
      }

      window.location.assign(body.data.payment_url);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "شروع پرداخت با خطا مواجه شد.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          disabled={disabled}
          aria-expanded={action === "deposit"}
          onClick={() => {
            setAction(action === "deposit" ? null : "deposit");
            setError(null);
          }}
          className={buttonClassName}
        >
          افزایش موجودی
        </Button>
        <Button
          type="button"
          disabled={disabled}
          aria-describedby={action === "withdraw" ? messageId : undefined}
          onClick={() => setAction(action === "withdraw" ? null : "withdraw")}
          className={buttonClassName}
        >
          برداشت وجه
        </Button>
      </div>

      {action === "deposit" && (
        <form onSubmit={startTopUp} className="mt-5 space-y-3">
          <label htmlFor={amountId} className="block text-sm text-text-muted">
            مبلغ افزایش موجودی ({WALLET_CURRENCY_LABEL})
          </label>
          <div className="flex gap-2">
            <input
              id={amountId}
              inputMode="numeric"
              autoComplete="off"
              dir="ltr"
              value={amountToman ? amountFormatter.format(amountToman) : amountText}
              onChange={(event) => setAmountText(event.target.value)}
              placeholder="۵۰۰٬۰۰۰"
              disabled={submitting}
              aria-invalid={!!error}
              aria-describedby={error ? messageId : undefined}
              className="
                h-12 min-w-0 flex-1 rounded-full bg-element-bg px-4 text-center
                text-base tabular-nums text-text-primary
                focus-visible:outline-2 focus-visible:outline-approve
              "
            />
            <Button
              type="submit"
              disabled={submitting || !amountToman}
              className={`${buttonClassName} shrink-0 px-6`}
            >
              {submitting ? "در حال انتقال..." : "پرداخت"}
            </Button>
          </div>
          {error && (
            <p id={messageId} role="alert" className="text-xs leading-6 text-danger">
              {error}
            </p>
          )}
        </form>
      )}

      {action === "withdraw" && (
        <p id={messageId} role="status" className="mt-4 text-xs leading-6 text-text-muted">
          برداشت وجه هنوز فعال نشده است. هیچ درخواست برداشتی ثبت نشده است.
        </p>
      )}
    </div>
  );
}
