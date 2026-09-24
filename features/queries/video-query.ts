import { queryOptions } from "@tanstack/react-query";
import { getVideo } from "../api/get-video";

export function videoQueryOptions(slug: string, order?: number, id?:number) {
  return queryOptions({
    queryKey: ["course", slug, order, id],
    queryFn: () => getVideo(slug, order, id),
    staleTime: 60 * 1000,
  });
}
