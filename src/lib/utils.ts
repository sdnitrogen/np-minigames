import { wordList } from "@/constants"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomWord = (list: string[]) => {
  return list[Math.floor(Math.random() * list.length)]
}

export const getRandomWordsList = () => {
  const resWordList = wordList.sort(() => 0.5 - Math.random()).slice(0, 25)
  return resWordList
}
