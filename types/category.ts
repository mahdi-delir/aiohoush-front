export type CategoryIcon =
  | "start"
  | "google"
  | "resume"
  | "calc"
  | "diabetes";
export interface CategoryItem {
  id: number;
  title: string;
  icon: CategoryIcon;
  slug: string
}

export interface GiftCategoryResponse {
  data: CategoryItem[];
}