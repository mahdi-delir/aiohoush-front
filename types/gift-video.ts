export interface GiftVideoItem {
  id: number;
  title: string;
  slug: string;
  playerUrl?: string | null;
  cover?: string | null;
  duration: string;
  order: number;
  is_public: boolean;
}

export interface GiftVideosData {
  videos: GiftVideoItem[];
}