import { useQuery } from "@tanstack/react-query";
import { getGiftVideo } from "../api/get-giftvideo";

export function useGetGiftVideo(category?: string) {
  return useQuery({
    queryKey: ["giftvideo", category],
    queryFn: () => getGiftVideo(category!),
    enabled: !!category,
  });
}
