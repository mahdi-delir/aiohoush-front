import "server-only";

import { fetchDjango } from "@/lib/django";
import type { ApiResponse } from "@/types/api";
import type { WalletData } from "@/types/wallet";

export async function getWallet(): Promise<ApiResponse<WalletData> | null> {
  const response = await fetchDjango("/accounting/wallet/", {
    method: "GET",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ApiResponse<WalletData>;
}
