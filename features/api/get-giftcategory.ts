import type { GiftCategoryResponse } from "@/types/category";
import { mockGiftCat } from "@/mocks/gift-categories";

// GET api.aiohoush.com/gift/categories
export async function getGiftCat(): Promise<GiftCategoryResponse> {
    return mockGiftCat
}