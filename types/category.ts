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
  | "web"
  | "microphone"
  | "book"
  | "calculator"
  | "training";
  
export interface CategoryItem {
  id: number
  title: string
  en_title?: string
  icon?: CategoryIcon
  slug: string
}

export interface CategoryResponse {
  categories: CategoryItem[];
}