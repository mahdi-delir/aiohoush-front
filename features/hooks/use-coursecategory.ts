import { useQuery } from "@tanstack/react-query";
import { getCourseCat } from "../api/get-courseCategory";

export function useCourseCategory() {
  return useQuery({
    queryFn: getCourseCat,
    queryKey: ["courseCategory"],
  });
}
