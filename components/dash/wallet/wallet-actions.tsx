"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/button";

export default function WalletActions({ disabled = false }: { disabled?: boolean }) {
  const messageId = useId();
  const [action, setAction] = useState<"deposit" | "withdraw" | null>(null);

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          disabled={disabled}
          aria-describedby={action ? messageId : undefined}
          onClick={() => setAction("deposit")}
          className="
            h-12 rounded-full px-3 text-sm font-bold text-black
            shadow-lg shadow-primary-green/20
            hover:bg-primary-green-hover
            focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-approve
            disabled:cursor-not-allowed disabled:opacity-50
            motion-safe:transition-colors
          "
        >
          افزایش موجودی
        </Button>
        <Button
          type="button"
          disabled={disabled}
          aria-describedby={action ? messageId : undefined}
          onClick={() => setAction("withdraw")}
          className="
            h-12 rounded-full px-3 text-sm font-bold text-black
            shadow-lg shadow-primary-green/20
            hover:bg-primary-green-hover
            focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-approve
            disabled:cursor-not-allowed disabled:opacity-50
            motion-safe:transition-colors
          "
        >
          برداشت وجه
        </Button>
      </div>
      <p id={messageId} role="status" className={action ? "mt-4 text-xs leading-6 text-text-muted" : "sr-only"}>
        {action === "deposit"
          ? "افزایش موجودی هنوز فعال نشده است. هیچ پرداختی انجام نشده است."
          : action === "withdraw"
            ? "برداشت وجه هنوز فعال نشده است. هیچ درخواست برداشتی ثبت نشده است."
            : ""}
      </p>
    </div>
  );
}
