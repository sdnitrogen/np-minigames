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

export const rotateLeft = <T>(a: T[][]) =>
  a[0].map((_, c) => a.map((r) => r[c])).reverse()
export const rotateRight = <T>(a: T[][]) =>
  a[0].map((_, c) => a.map((r) => r[c]).reverse())
