export type CategoryIcon =
  | "start"
  | "google"
  | "resume"
  | "calc"
  | "diabetes"
  | "school"
  | "code"
  | "chatbot"
  | "drawing"
  | "web";
  
export interface CategoryItem {
  id: number;
  title: string;
  icon: CategoryIcon;
  slug: string
}

export interface CategoryResponse {
  categories: CategoryItem[];
}