import { useRouter, useSearchParams } from "next/navigation";

export const useSearchPageNavigation = (query: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query);
    params.set("page", newPage.toString());
    router.push(`/search?${params.toString()}`);
  };

  return { handlePageChange };
};
