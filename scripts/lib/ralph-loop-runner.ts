export function parseLoopConcurrencyLimit(rawValue?: string) {
  if (!rawValue) {
    return 5;
  }

  const parsedValue = Number.parseInt(rawValue, 10);
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    throw new Error(
      [
        `Invalid --concurrency value: ${rawValue}.`,
        "Fix: pass a positive integer such as --concurrency=5.",
      ].join("\n"),
    );
  }

  return parsedValue;
}

export async function runWithConcurrencyLimit<T>(
  items: T[],
  concurrencyLimit: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  const normalizedConcurrency = Math.max(1, Math.min(concurrencyLimit, items.length));
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: normalizedConcurrency }, async () => {
      while (nextIndex < items.length) {
        const currentIndex = nextIndex;
        nextIndex += 1;
        await worker(items[currentIndex] as T, currentIndex);
      }
    }),
  );
}
