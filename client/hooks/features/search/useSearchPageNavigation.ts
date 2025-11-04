import { useRouter, useSearchParams } from "next/navigation";

export const useSearchPageNavigation = (
  query: string,
  currentLimit: number
) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query);
    params.set("page", newPage.toString());
    if (currentLimit !== 10) {
      params.set("limit", currentLimit.toString());
    }
    router.push(`/search?${params.toString()}`);
  };

  return { handlePageChange };
};
