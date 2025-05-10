import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
