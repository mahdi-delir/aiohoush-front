import { mockHomework } from "@/mocks/homework";
import { ApiResponse } from "@/types/global";
import {  HomeworkSubmission } from "@/types/homework";

// Replace this adapter after the authenticated Django API contract is agreed.
export async function getMyHomework(courseId: number): Promise<ApiResponse<HomeworkSubmission[]>> {
  return mockHomework
}