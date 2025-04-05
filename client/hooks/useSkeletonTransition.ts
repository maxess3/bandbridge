import { useState, useEffect } from "react";

interface UseSkeletonTransitionProps {
  isLoading: boolean;
  delay?: number;
}

export function useSkeletonTransition({
  isLoading,
  delay = 300,
}: UseSkeletonTransitionProps) {
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShouldShowSkeleton(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isLoading, delay]);

  return {
    shouldShowSkeleton,
    isTransitioning: !isLoading && shouldShowSkeleton,
  };
}
