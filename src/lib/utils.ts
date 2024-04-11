import { wordList, words7 } from "@/constants"
import { type ClassValue, clsx } from "clsx"
import _ from "lodash"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomWord = (list: string[]) => {
  return list[Math.floor(Math.random() * list.length)]
}

export const getRandomWordsList = () => {
  const resWordList = _.shuffle(wordList).slice(0, 25)
  return resWordList
}

export const get7LetterWords = () => {
  const res7Words = _.shuffle(words7).slice(0, 11)
  return res7Words
}

export const rotateLeft = <T>(a: T[][]) =>
  a[0].map((_, c) => a.map((r) => r[c])).reverse()
export const rotateRight = <T>(a: T[][]) =>
  a[0].map((_, c) => a.map((r) => r[c]).reverse())
