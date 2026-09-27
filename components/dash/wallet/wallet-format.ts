import type { Wallet } from "@/types/wallet";

const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatWalletAmount(amount: number): string {
  return numberFormatter.format(amount);
}

export function getWalletCurrency(currency: Wallet["currency"]): string {
  return currency === "IRT" ? "تومان" : "ریال";
}

export function formatWalletDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "تاریخ نامشخص" : dateFormatter.format(date);
}
