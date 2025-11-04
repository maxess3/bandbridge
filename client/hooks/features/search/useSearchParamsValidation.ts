import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { searchQuerySchema } from "@/lib/zod";

export const useSearchParamsValidation = () => {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const params = {
      q: searchParams.get("q") || "",
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    };

    const result = searchQuerySchema.safeParse(params);

    if (result.success) {
      return {
        query: result.data.q,
        page: result.data.page,
        limit: result.data.limit,
      };
    }

    return {
      query: params.q.trim() || "",
      page: 1,
      limit: 10,
    };
  }, [searchParams]);
};
