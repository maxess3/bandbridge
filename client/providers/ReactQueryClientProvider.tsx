"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { IoMdClose } from "react-icons/io";

interface ApiError extends Error {
  response?: {
    data: {
      message?: string;
    };
  };
}

interface ApiResponse {
  message?: string;
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onSuccess: (data: unknown) => {
      if ((data as ApiResponse)?.message) {
        toast.success((data as ApiResponse).message);
      }
    },
    onError: (error: ApiError) => {
      if (error.response?.data.message) {
        toast.error(error.response?.data.message);
      }
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (data: unknown) => {
      if ((data as ApiResponse)?.message) {
        toast.success((data as ApiResponse).message, {
          action: {
            label: (
              <div className="w-9 h-9 hover:bg-secondary rounded-full flex items-center justify-center">
                <IoMdClose className="text-xl" />
              </div>
            ),
            onClick: () => {},
          },
        });
      }
    },
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
