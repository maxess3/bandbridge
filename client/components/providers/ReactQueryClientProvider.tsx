"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiError extends Error {
  response?: {
    data: {
      message?: string;
    };
  };
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: ApiError) => {
      if (error.response?.data.message) {
        toast.error(error.response?.data.message);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: ApiError) => {
      if (error.response?.data.message) {
        toast.error(error.response?.data.message);
      }
    },
  }),
});

export const ReactQueryClientProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
