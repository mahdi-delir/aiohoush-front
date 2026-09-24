export interface Episod {
    id: number;
    title: string;
    subject: string;
    duration: string;
    wathced_percent: number;
    cover: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    intro_video: string;
    cover: string;
    duration: string;
    episod_count: number;
    level: string;
    has_access: boolean;
    episods: Episod[];
}