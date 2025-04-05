type DelayedFunction<TArgs extends any[], TReturn> = (
  ...args: TArgs
) => Promise<TReturn>;

export function createDelayedFunction<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn> | TReturn,
  delay = 400
): DelayedFunction<TArgs, TReturn> {
  return async (...args: TArgs) => {
    const start = Date.now();
    const result = await fn(...args);
    const end = Date.now();

    const elapsedTime = end - start;

    if (elapsedTime < delay) {
      const remainingTime = delay - elapsedTime;
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    return result;
  };
}
