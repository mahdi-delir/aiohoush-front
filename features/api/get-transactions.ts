import { mockTransactions } from "@/mocks/wallet";
import { ApiResponse } from "@/types/global";
import { Transaction } from "@/types/wallet";

export async function getTransactions(): Promise<ApiResponse<Transaction[]>> {
  return mockTransactions;
}
