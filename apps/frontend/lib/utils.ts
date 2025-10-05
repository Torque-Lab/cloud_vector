import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseDateWithLocale(dateString: string) {
  const date = new Date(dateString);
  const locale=navigator.language || 'en-US'
  return date.toLocaleDateString(locale);
}