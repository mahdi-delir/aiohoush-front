import "server-only";
import { mockProjects } from "@/mocks/projects";
import type { ProjectGalleryData } from "@/types/project";
import { ApiResponse } from "@/types/global";

export async function getPublicProjects(): Promise<ApiResponse<ProjectGalleryData>> {
  return mockProjects;
}
