export type ProjectCategory = "aiohoush" | "students";

export interface PublicStudentProfile {
  id: number;
  name: string;
  bio: string;
}

export interface PublicProject {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  category: ProjectCategory;
  studentId: number | null;
  artwork: "workspace" | "analytics" | "learning" | "portfolio";
  githubUrl: string | null;
  files: { id: string; name: string; url: string; sizeLabel: string }[];
}

export interface ProjectGalleryData {
  projects: PublicProject[];
  students: PublicStudentProfile[];
}