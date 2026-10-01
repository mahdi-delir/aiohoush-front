import "server-only";
import { mockProjects } from "@/mocks/projects";
import type { ProjectGalleryData } from "@/types/project";
import { ApiResponse } from "@/types/api";

export async function getPublicProjects(): Promise<ApiResponse<ProjectGalleryData>> {
  return mockProjects;
}
