import {
  MutationFunction,
  MutationKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import { createDelayedFunction } from "@/helper/createDelayedFunction";

export const useDelayedMutation = <
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn: MutationFunction<TData, TVariables>,
  options?: UseMutationOptions<TData, TError, TVariables, TContext> & {
    delay?: number;
  }
): UseMutationResult<TData, TError, TVariables, TContext> => {
  const delayedFn = createDelayedFunction(mutationFn, options?.delay ?? 400);

  return useMutation({
    mutationKey,
    mutationFn: delayedFn,
    ...options,
  });
};
