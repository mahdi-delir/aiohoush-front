export interface Wallet {
  userId: number;
  balance: number;
  currency: "IRT" | "IRR";
}

export interface Transaction {
  side: "withdraw" | "deposit";
  gate?: "cash" | "online" | "transfer";
  title: string;
  date: string;
  amount: number;
  trackId?: number;
  customerCard?: number;
  receiptUrl?: string;
  status: "confirmed" | "rejected" | "pending";
}


