import { mockWallet } from "@/mocks/wallet";
import { ApiResponse } from "@/types/global";
import { Wallet } from "@/types/wallet";

export async function getBalance():Promise<ApiResponse<Wallet>>{
    return mockWallet
}