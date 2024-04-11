"use client"

import { KeyboardEvent, useEffect, useRef, useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Header from "@/components/Header"
import Description from "@/components/Description"
import { gib, sniffDescription } from "@/constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import _ from "lodash"
import { Input } from "@/components/ui/input"
import { ChevronRight } from "lucide-react"
import { get7LetterWords } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

const genRanHex = (size: number) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("")

const generatePasswordsBoard = (wordList: string[]) => {
  const nums = new Set()
  while (nums.size !== 11) {
    nums.add(Math.floor(Math.random() * 32) + 1)
  }

  const array: string[] = []
  while (array.length < 32) {
    if (nums.has(array.length)) {
      const idx = Math.floor(Math.random() * (gib.length - 7))
      nums.delete(array.length)
      const word = [
        ..._.shuffle(gib).slice(0, idx),
        wordList[nums.size],
        ..._.shuffle(gib).slice(idx + 7),
      ].join("")
      array.push(word)
    } else {
      array.push(_.shuffle(gib).join(""))
    }
  }

  const board = []
  while (array.length) board.push(array.splice(0, 2))
  return board
}

const Sniff = () => {
  const entriesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState<string>("")
  const [passwordInput, setPasswordInput] = useState<string>("")
  const [passwordsBoard, setPasswordsBoard] = useState<string[][]>([])
  const [tier, setTier] = useState<number>(0)
  const [tries, setTries] = useState<number>(7)
  const [entries, setEntries] = useState<number[][]>([])

  const scrollToBottom = () => {
    entriesEndRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [entries])

  const startGame = () => {
    const wordList = get7LetterWords()
    setPassword(_.shuffle(wordList)[0].toUpperCase())
    const generatedPasswordsBoard = generatePasswordsBoard(wordList)
    setPasswordsBoard(generatedPasswordsBoard)
    setTries(7 - tier)
    setEntries([])
    setLoading(true)
    setResult("Init")
    setTimeout(() => {
      setResult("")
      setOpen(false)
      setLoading(false)
      inputRef.current?.focus()
    }, 3000)
  }

  const checkKeyInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitPassword()
  }

  const submitPassword = () => {
    if (result !== "") return
    if (passwordInput === password) {
      const left = tries - entries.length
      setEntries([...entries, [7, left]])
      setPasswordInput("")
      setOpen(true)
      setResult("S U C C E S S !")
    } else {
      if (entries.length === tries - 1) {
        setOpen(true)
        setResult("F A I L E D !")
      }
      let count = 0
      for (let i = 0; i < 7; i++) {
        password[i] === passwordInput[i] && count++
      }
      const left = tries - entries.length
      setEntries([...entries, [count, left]])
      setPasswordInput("")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="bg-primary w-64">
          <AlertDialogHeader className="items-center">
            <AlertDialogTitle
              className={`${
                result === "S U C C E S S !" ? "text-green-500" : "text-red-500"
              } text-2xl`}>
              {result}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel className="w-24">Ok</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Header title="Sniff - Crypto Hack" />
      <Description desc={sniffDescription} />
      <section className="flex flex-1 flex-col items-center w-full p-2">
        <div className="flex flex-row items-center justify-between gap-2 w-[48rem] mt-auto px-2">
          <Select
            defaultValue={tier.toString()}
            onValueChange={(val: string) => setTier(Number(val))}>
            <Label>Protection Tier : </Label>
            <SelectTrigger className="w-24 mr-auto">
              <SelectValue placeholder="Select time diffiulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loading && <Skeleton className="w-[48rem] h-[32rem]" />}
        {!loading && (
          <ScrollArea className="flex flex-col items-start border-2 border-muted w-[48rem] h-[32rem] p-4">
            {passwordsBoard.length > 0 && (
              <div className="flex flex-row items-center gap-2 text-sm font-semibold text-yellow-300">
                <div className="w-2 h-2 rounded-full bg-green-300" />
                Find the password in the computer's memory :
              </div>
            )}
            {passwordsBoard.length > 0 && (
              <div className="flex flex-row items-center gap-2 text-sm font-semibold text-yellow-300">
                <div className="w-2 h-2 rounded-full bg-green-300" />
                <span>Protection tier : </span>
                <span className="text-green-500">{tier}</span>
              </div>
            )}
            {passwordsBoard.length > 0 && (
              <div className="flex flex-row items-center gap-2 text-sm font-semibold text-yellow-300">
                <div className="w-2 h-2 rounded-full bg-green-300" />
                <span>Tries remaining : </span>
                <span className="text-green-500">{tries}</span>
              </div>
            )}
            {passwordsBoard.map((row, i) => (
              <div
                key={`row-${i}`}
                className="flex flex-row items-center gap-4 text-sm font-semibold">
                <div className="w-2 h-2 rounded-full bg-green-300" />
                {row.map((col, j) => (
                  <div
                    key={`cell-${i}-${j}`}
                    className={`flex flex-row gap-4 w-max items-center justify-center`}>
                    <span className="w-16 text-red-500 text-justify">{`0x${genRanHex(
                      4
                    )}`}</span>
                    <span
                      className={`${
                        i === 11 && j === 1 && "text-red-500"
                      } uppercase w-60 text-justify`}>
                      {col}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {entries.map((entry, i) => (
              <div key={i}>
                <div className="flex flex-row items-center gap-4 text-sm font-semibold">
                  <div className="w-2 h-2 rounded-full bg-green-300" />
                  <span>{`${
                    entry[0] === 7 ? "Access Granted" : "Access Denied"
                  } (${entry[0]}/7)`}</span>
                </div>
                <div className="flex flex-row items-center gap-4 text-sm font-semibold">
                  <div className="w-2 h-2 rounded-full bg-green-300" />
                  <span>{`${
                    entry[0] === 7
                      ? "Hacking..."
                      : `${entry[1] - 1} tries remaining`
                  }`}</span>
                </div>
              </div>
            ))}
            <div ref={entriesEndRef} />
          </ScrollArea>
        )}
        <div className="flex w-[48rem] h-8 flex-row items-start space-x-2">
          <Input
            type="text"
            placeholder="Type  Password  here"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value.toUpperCase())}
            onKeyUp={(e) => checkKeyInput(e)}
            className="flex-1 rounded-none border-muted-foreground uppercase"
            ref={inputRef}
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-none border-muted-foreground hover:text-secondary hover:bg-primary"
            onClick={submitPassword}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button className="w-[16rem] mt-8" onClick={startGame}>
          Play
        </Button>
      </section>
    </main>
  )
}

export default Sniff
