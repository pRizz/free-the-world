import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names in a shadcn-compatible way.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
