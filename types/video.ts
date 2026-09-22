export interface VideoItem {
    id: number;
    playerUrl: string;
    title: string;
    slug: string;
    description?: string
}

export interface GiftVideoResponse {
    data: VideoItem
}

export interface VideosResponse {
    data: VideoItem[]
}