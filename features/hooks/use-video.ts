"use client";
import { useQuery } from "@tanstack/react-query";

import { videoQueryOptions } from "../queries/video-query";
export function useGetVideo(slug: string, id?: number, order?: number) {
  return useQuery(videoQueryOptions(slug, id , order));
}