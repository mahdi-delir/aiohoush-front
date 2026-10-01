import { mockWallet } from "@/mocks/wallet";
import { ApiResponse } from "@/types/api";
import { Wallet } from "@/types/wallet";

export async function getBalance():Promise<ApiResponse<Wallet>>{
    return mockWallet
}