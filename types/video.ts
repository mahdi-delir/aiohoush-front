export interface VideoItem {
    id: number;
    playerUrl?: string;
    title?: string;
    order: number;
    short_desc?: string;
    slug?: string;
    description?: string;
    has_source_code: boolean;
    has_homework: boolean;
    is_public: boolean;
    duration: string;
    wathced_percent?: number,
    cover: string;
    source_code?: string;
    source_code_url?: string
}

export interface VideoResponse {
    video: VideoItem
}

export interface VideosResponse {
    videos: VideoItem[]
}