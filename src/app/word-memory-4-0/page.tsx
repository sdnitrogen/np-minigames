"use client"

import Description from "@/components/Description"
import Header from "@/components/Header"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { wordMemoryDescription } from "@/constants"
import { getRandomWord, getRandomWordsList } from "@/lib/utils"
import { useEffect, useState } from "react"

const WordMemory = () => {
  const [targetTime, setTargetTime] = useState(20)
  const [word, setWord] = useState("")
  const [list, setList] = useState<string[]>([])
  const [tracker, setTracker] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [result, setResult] = useState("")
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(100)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let interval: any
    if (timeLeft > 0 && result === "") {
      const reducedTime = timeLeft - 0.1
      interval = setInterval(() => {
        setTimeLeft(reducedTime)
        setProgress((reducedTime / targetTime) * 100)
      }, 100)
    } else if (progress <= 0 && result === "") {
      setOpen(true)
      setResult("F A I L E D !")
    }
    return () => clearInterval(interval)
  }, [timeLeft])

  const startGame = () => {
    setLoading(true)
    setResult("Init")
    setTimeout(() => {
      setScore(0)
      setTracker([])
      setResult("")
      setOpen(false)
      const randomWordList = getRandomWordsList()
      setList(randomWordList)
      setWord(getRandomWord(randomWordList))
      setTimeLeft(targetTime)
      setProgress(100)
      setLoading(false)
    }, 3000)
  }

  const handleSeen = () => {
    if (tracker.includes(word)) {
      setScore(score + 1)
      if (score === 24) {
        setOpen(true)
        setResult("S U C C E S S !")
      } else {
        setWord(getRandomWord(list))
      }
    } else {
      setOpen(true)
      setResult("F A I L E D !")
    }
  }

  const handleUnseen = () => {
    const trackerSet = new Set(tracker)
    if (trackerSet.has(word)) {
      setOpen(true)
      setResult("F A I L E D !")
    } else {
      setScore(score + 1)
      if (score === 24) {
        setOpen(true)
        setResult("S U C C E S S !")
      } else {
        setTracker([...tracker, word])
        setWord(getRandomWord(list))
      }
    }
  }

  const handleAlertClose = () => {
    setScore(0)
    setTracker([])
    setResult("")
    setOpen(false)
    setWord("")
    setProgress(100)
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-8">
      <AlertDialog open={open} onOpenChange={handleAlertClose}>
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
      <Header title="Word Memory" />
      <Description desc={wordMemoryDescription} />
      <section className="flex flex-1 flex-col items-center justify-center gap-2 w-full p-2">
        <div className="flex flex-row items-center justify-between gap-2 w-[32rem] mt-auto px-2">
          <Select
            defaultValue={targetTime.toString()}
            onValueChange={(val: string) => setTargetTime(Number(val))}>
            <Label>Time difficulty : </Label>
            <SelectTrigger className="w-48 mr-auto">
              <SelectValue placeholder="Select time diffiulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">Cash Exchange</SelectItem>
              <SelectItem value="20">Maze Bank</SelectItem>
            </SelectContent>
          </Select>
          {score} / 25
        </div>
        {loading && <Skeleton className="rounded-lg w-[32rem] h-[12rem]" />}
        {!loading && (
          <div className="flex flex-col items-center justify-center bg-muted rounded-lg w-[32rem] h-[12rem] text-primary text-5xl font-bold">
            <span className="mt-auto">{word}</span>
            <Progress
              value={progress}
              className="w-full mt-auto rounded-none"
            />
          </div>
        )}
        <div className="flex flex-row gap-1 w-[32rem]">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-900 text-white font-bold"
            disabled={word === ""}
            onClick={handleSeen}>
            Seen
          </Button>
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-900 text-white font-bold"
            disabled={word === ""}
            onClick={handleUnseen}>
            Unseen
          </Button>
        </div>
        <Button className="w-[16rem] mt-auto" onClick={startGame}>
          Play
        </Button>
      </section>
    </main>
  )
}

export default WordMemory
