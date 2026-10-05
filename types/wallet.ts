/** همهٔ مبالغ به ریال؛ نمایش به تومان با wallet-format انجام می‌شود. */
export interface WalletData {
  currency: "IRR";
  balance: number;
  /** واریزهای ثبت‌شده‌ای که هنوز حسابداری تأیید نکرده */
  pending_deposits: number;
  transactions: Transaction[];
}

export type TransactionKind =
  | "deposit"
  | "course_purchase"
  | "ai_purchase"
  | "reversal"
  | "charge"
  | "installment"
  | "commission"
  | "reward"
  | "penalty"
  | "salary"
  | "salary_payout"
  | "withdrawal";

export interface Transaction {
  id: string;
  side: "withdraw" | "deposit";
  kind: TransactionKind;
  title: string;
  description: string | null;
  date: string;
  amount: number;
  status: "confirmed" | "rejected" | "pending";
  gate: "online" | "transfer" | null;
  tracking_code: string | null;
  card_last4: string | null;
}
