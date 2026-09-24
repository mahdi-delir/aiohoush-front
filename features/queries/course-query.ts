import { queryOptions } from "@tanstack/react-query";
import { getCourse } from "@/features/api/get-course";

export function courseQueryOptions(slug: string) {
  return queryOptions({
    queryKey: ["course", slug],
    queryFn: () => getCourse(slug),
    staleTime: 60 * 1000,
  });
}
