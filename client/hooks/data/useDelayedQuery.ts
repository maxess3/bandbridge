import {
  QueryFunction,
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { createDelayedFunction } from "@/utils";

export const useDelayedQuery = <T, Error = unknown>(
  queryKey: QueryKey,
  queryFn: QueryFunction<T, QueryKey>,
  options?: UseQueryOptions<T, Error, T, QueryKey> & { delay?: number }
): UseQueryResult<T, Error> => {
  const delayedFn = createDelayedFunction(queryFn, options?.delay ?? 400);

  return useQuery({
    queryKey,
    queryFn: delayedFn,
    ...options,
  });
};
