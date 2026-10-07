export interface VideoItem {
  id: number;
  playerUrl?: string | null;
  title?: string;
  order: number;
  short_desc?: string;
  description?: string;
  has_source_code: boolean;
  has_homework: boolean;
  is_public: boolean;
  is_locked?: boolean;
  duration: string;
  watched_percent?: number;
  cover?: string | null;
  source_code_url?: string | null;
}