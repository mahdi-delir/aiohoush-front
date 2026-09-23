export interface VideoItem {
    id: number;
    playerUrl: string;
    title: string;
    short_desc?: string;
    desc?: string;
    slug?: string;
    category: string;
    description?: string;
    has_source_code: boolean;
    has_homework: boolean;
}

export interface VideoResponse {
    video: VideoItem
}

export interface VideosResponse {
    videos: VideoItem[]
}