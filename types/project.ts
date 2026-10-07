export type ProjectKind = "aiohoush" | "student";

export type ProjectStatus = "pending" | "approved" | "rejected";

export interface ProjectTechnology {
  id: number;
  title: string;
}

export interface ProjectCourse {
  id: number;
  title: string;
}

export interface ProjectCard {
  id: number;
  kind: ProjectKind;
  title: string;
  summary: string;
  cover: string | null;
  imageCount: number;
  technologies: string[];
  course: ProjectCourse | null;
  author: { name: string } | null;
}

export interface ProjectGalleryData {
  projects: ProjectCard[];
  counts: Record<ProjectKind, number>;
  total: number;
  page: number;
  pageCount: number;
  technologies: ProjectTechnology[];
}

export interface ProjectFileItem {
  id: number;
  name: string;
  size: number;
  url: string;
}

export interface ProjectDetail extends Omit<ProjectCard, "technologies" | "author"> {
  description: string;
  images: { id: number; url: string }[];
  technologies: ProjectTechnology[];
  githubUrl: string | null;
  demoUrl: string | null;
  isMine: boolean;
  createdAt: string;
  files: ProjectFileItem[] | null;
  author: { name: string; bio: string; avatar: string | null } | null;
  status?: ProjectStatus;
  statusLabel?: string;
  rejectionReason?: string | null;
}

export interface MyProject extends ProjectCard {
  status: ProjectStatus;
  statusLabel: string;
  rejectionReason: string | null;
  updatedAt: string;
}

export interface ProjectOptions {
  technologies: ProjectTechnology[];
  courses: ProjectCourse[];
}

export interface ProjectFormValues {
  title: string;
  description: string;
  course: number | null;
  technologies: number[];
  github_url: string;
  demo_url: string;
}
