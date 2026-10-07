"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApiClientError } from "@/lib/api/client";

import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) =>
              failureCount < 2 &&
              (!(error instanceof ApiClientError) || error.status >= 500),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
