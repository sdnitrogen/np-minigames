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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { fingerprintScannerDescription } from "@/constants"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import _ from "lodash"
import { KeyboardEvent, useEffect, useState } from "react"

const generateCode = () => {
  const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
  const code = _.shuffle(nums).slice(0, 4)
  return code
}

const PinCracker = () => {
  const [targetTime, setTargetTime] = useState(15)
  const [code, setCode] = useState<string[]>([])
  const [number, setNumber] = useState<string>("")
  const [tracker, setTracker] = useState<string[]>([])
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
    setTracker([])
    setLoading(true)
    setResult("Init")
    setTimeout(() => {
      setResult("")
      setOpen(false)
      const genCode = generateCode()
      setCode(genCode)
      setNumber("")
      setTimeLeft(targetTime)
      setProgress(100)
      setLoading(false)
    }, 3000)
  }

  const checkKeyInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit()
  }

  const handleSubmit = () => {
    if (number.length < 4) return
    if (number === code.join("")) {
      setTracker(["g", "g", "g", "g"])
      setOpen(true)
      setResult("S U C C E S S !")
    } else {
      const input = number.split("")
      const status: string[] = []
      input.forEach((el, i) => {
        if (code.includes(el) && code[i] === el) status.push("g")
        else if (code.includes(el) && code[i] !== el) status.push("y")
        else status.push("r")
      })
      setTracker(status)
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
      <Header title="PinCracker - Fingerprint Scanner" />
      <Description desc={fingerprintScannerDescription} />
      <section className="flex flex-1 flex-col items-center justify-center gap-2 w-full p-2">
        {loading && (
          <Skeleton className="rounded-lg w-[32rem] h-[12rem] mt-auto" />
        )}
        {!loading && (
          <div className="flex flex-col items-center justify-between mt-auto rounded-lg w-[32rem] h-[12rem] text-primary text-5xl font-bold">
            <InputOTP
              maxLength={4}
              value={number}
              onChange={(value) => setNumber(value)}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={code.length === 0 || result !== ""}
              onKeyUp={(e) => checkKeyInput(e)}>
              <InputOTPGroup>
                <InputOTPSlot
                  index={0}
                  className={`h-24 w-24 border-muted-foreground text-6xl ${
                    tracker.length === 4 &&
                    tracker[0] === "g" &&
                    "border-b-4 border-b-green-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[0] === "y" &&
                    "border-b-4 border-b-yellow-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[0] === "r" &&
                    "border-b-4 border-b-red-500"
                  }`}
                />
                <InputOTPSlot
                  index={1}
                  className={`h-24 w-24 border-muted-foreground text-6xl ${
                    tracker.length === 4 &&
                    tracker[1] === "g" &&
                    "border-b-4 border-b-green-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[1] === "y" &&
                    "border-b-4 border-b-yellow-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[1] === "r" &&
                    "border-b-4 border-b-red-500"
                  }`}
                />
                <InputOTPSlot
                  index={2}
                  className={`h-24 w-24 border-muted-foreground text-6xl ${
                    tracker.length === 4 &&
                    tracker[2] === "g" &&
                    "border-b-4 border-b-green-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[2] === "y" &&
                    "border-b-4 border-b-yellow-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[2] === "r" &&
                    "border-b-4 border-b-red-500"
                  }`}
                />
                <InputOTPSlot
                  index={3}
                  className={`h-24 w-24 border-muted-foreground text-6xl ${
                    tracker.length === 4 &&
                    tracker[3] === "g" &&
                    "border-b-4 border-b-green-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[3] === "y" &&
                    "border-b-4 border-b-yellow-500"
                  } ${
                    tracker.length === 4 &&
                    tracker[3] === "r" &&
                    "border-b-4 border-b-red-500"
                  }`}
                />
              </InputOTPGroup>
            </InputOTP>
            <Progress value={progress} className="w-full rounded-none" />
          </div>
        )}
        <div className="flex items-center w-[32rem]">
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-900 text-white font-bold"
            disabled={number === ""}
            onClick={handleSubmit}>
            Crack
          </Button>
        </div>
        <Button className="w-[16rem] mt-auto" onClick={startGame}>
          Play
        </Button>
      </section>
    </main>
  )
}

export default PinCracker
