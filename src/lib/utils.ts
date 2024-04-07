import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomWord = (list: string[]) => {
  return list[Math.floor(Math.random() * list.length)]
}
