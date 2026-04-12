import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countJsonLines(data: unknown): number {
  if (data === null || typeof data !== "object") return 1;
  if (Array.isArray(data)) {
    if (data.length === 0) return 1;
    let count = 2;
    data.forEach((item) => {
      count += countJsonLines(item);
    });
    return count;
  }
  const keys = Object.keys(data as object);
  if (keys.length === 0) return 1;
  let count = 2;
  keys.forEach((key) => {
    count += countJsonLines((data as Record<string, unknown>)[key]);
  });
  return count;
}
