import { ApiResponse } from "@/types/api";
import { Transaction, Wallet } from "@/types/wallet";

export const mockWallet: ApiResponse<Wallet> = {
  success: true,
  called_by: "webapp",
  message: "دریافت اطلاعات از سرور با موفقیت انجام شد",
  data: {
    balance: 1250000,
    currency: "IRT",
    userId: 1,
  },
};

export const mockTransactions: ApiResponse<Transaction[]> = {
  success: true,
  called_by: "webapp",
  message: "دریافت اطلاعات از سرور با موفقیت انجام شد",
  data: [
    {
      side: "deposit",
      gate: "online",
      title: "شارژ کیف پول",
      date: "2026-09-27T09:30:00+03:30",
      amount: 500_000,
      trackId: 1405001001,
      status: "confirmed",
    },
    {
      side: "withdraw",
      title: "خرید دوره مقدماتی پایتون",
      date: "2026-09-26T15:45:00+03:30",
      amount: 350_000,
      trackId: 1405001002,
      status: "confirmed",
    },
    {
      side: "deposit",
      gate: "transfer",
      title: "شارژ کیف پول با انتقال وجه",
      date: "2026-09-26T11:20:00+03:30",
      amount: 1_000_000,
      trackId: 1405001003,
      status: "pending",
    },
    {
      side: "deposit",
      gate: "online",
      title: "شارژ ناموفق کیف پول",
      date: "2026-09-25T18:10:00+03:30",
      amount: 250_000,
      trackId: 1405001004,
      status: "rejected",
    },
    {
      side: "deposit",
      gate: "cash",
      title: "واریز نقدی به کیف پول",
      date: "2026-09-24T10:00:00+03:30",
      amount: 750_000,
      trackId: 1405001005,
      status: "confirmed",
    },
    {
      side: "withdraw",
      gate: "transfer",
      title: "درخواست برداشت از کیف پول",
      date: "2026-09-23T14:30:00+03:30",
      amount: 200_000,
      trackId: 1405001006,
      status: "pending",
    },
    {
      side: "deposit",
      title: "بازگشت وجه دوره لغوشده",
      date: "2026-09-22T12:15:00+03:30",
      amount: 400_000,
      trackId: 1405001007,
      status: "confirmed",
    },
    {
      side: "withdraw",
      gate: "transfer",
      title: "درخواست برداشت ردشده",
      date: "2026-09-21T16:40:00+03:30",
      amount: 300_000,
      trackId: 1405001008,
      status: "rejected",
    },
  ],
};
