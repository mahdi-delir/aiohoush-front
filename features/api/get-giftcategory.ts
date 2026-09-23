import type { GiftCategoryResponse } from "@/types/category";
import { mockGiftCat } from "@/mocks/gift-categories";
import { ApiResponse } from "@/types/global";

// GET api.aiohoush.com/gift/categories
export async function getGiftCat(): Promise<ApiResponse<GiftCategoryResponse>> {
    return mockGiftCat
}