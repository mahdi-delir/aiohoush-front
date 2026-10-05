const numberFormatter = new Intl.NumberFormat("fa-IR");
const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const WALLET_CURRENCY_LABEL = "تومان";

/** مبلغ ریالی API را به تومان نمایش می‌دهد (بدون علامت). */
export function formatWalletAmount(rial: number): string {
  return numberFormatter.format(Math.trunc(Math.abs(rial) / 10));
}

export function formatWalletDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "تاریخ نامشخص" : dateFormatter.format(date);
}
