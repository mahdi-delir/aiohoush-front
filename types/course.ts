import { VideoItem } from "./video";

export interface Season {
  title: string;
  subject: string;
  duration: string;
  episod_count: number;
  episods: VideoItem[];
}

export interface CourseCategory {
  en: string;
  fa: string;
}

export interface CourseInfo {
  id: number;
  title: string;
  short_description: string;
  description: string;
  cover: string;
  /** ویدئوی معرفی دوره؛ برای همه (حتی بدون خرید) قابل پخش است. */
  intro_video?: string | null;
  duration: string;
  episod_count: number;
  season_count: number;
  level: string;
  has_access: boolean;
  slug: string;
  categories?: CourseCategory[];
  watched_percent?: number;
}

export interface Course {
  course: CourseInfo;
  seasons: Season[];
}

export interface CourseList {
  courses: CourseInfo[];
}

export interface CategoriedCourse {
  fa_category: string;
  en_category: string;
  slug?: string;
  courses: CourseInfo[];
}
