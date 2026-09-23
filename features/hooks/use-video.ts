import { useQuery } from "@tanstack/react-query";
import { getVideo } from "../api/get-video";

export function useGetVideo(category?: string) {
  return useQuery({
    queryKey: ["giftvideo", category],
    queryFn: () => getVideo(category!),
    enabled: !!category,
  });
}
