import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Book {
  id: string;
  title: string;
  authors?: string[];
  isbn: string;
  thumbnail: string;
  location: string;
  ownerId?: string;
}