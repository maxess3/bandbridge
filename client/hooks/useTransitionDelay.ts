import { useState } from "react";

interface UseTransitionDelayReturn {
  isDelaying: boolean;
  withDelay: <T>(callback: () => Promise<T>) => Promise<T>;
}

export const useTransitionDelay = (
  delay: number = 500
): UseTransitionDelayReturn => {
  const [isDelaying, setIsDelaying] = useState(false);

  const withDelay = async <T>(callback: () => Promise<T>): Promise<T> => {
    setIsDelaying(true);
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsDelaying(false);
    return callback();
  };

  return { isDelaying, withDelay };
};
