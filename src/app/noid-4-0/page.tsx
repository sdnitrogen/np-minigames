"use client"

import { useCallback, useEffect, useState } from "react"
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
import { noidDescription } from "@/constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import _ from "lodash"

const alphanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

const generateBoard = (row: number, col: number) => {
  const track = new Set<string>()
  while (track.size !== row * col) {
    track.add(
      alphanum.split("")[Math.floor(Math.random() * 36)] +
        alphanum.split("")[Math.floor(Math.random() * 36)]
    )
  }
  const array = Array.from(track)
  const board = []
  while (array.length) board.push(array.splice(0, 5))
  return board
}

const Noid = () => {
  const row = 5
  const col = 5
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [board, setBoard] = useState<string[][]>([])
  const [sequence, setSequence] = useState<string[]>([])
  const [click, setClick] = useState(0)
  const [score, setScore] = useState(0)
  const [misClicked, setMisClicked] = useState("")
  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    board.length > 0 &&
      result === "" &&
      setBoard(_.shuffle(board.map((r) => _.shuffle(r))))
  }, [time])

  const startGame = () => {
    const generatedBoard = generateBoard(row, col)
    setBoard(generatedBoard)
    const targetSeq = _.shuffle(generatedBoard.flat()).slice(0, 8)
    setSequence(targetSeq)
    setClick(0)
    setMisClicked("")
    setLoading(true)
    setResult("Init")
    setTimeout(() => {
      setResult("")
      setOpen(false)
      setLoading(false)
    }, 3000)
  }

  const handleBoxClick = useCallback(
    (cell: string) => {
      if (score === 7 && cell === sequence[click]) {
        setOpen(true)
        setResult("S U C C E S S !")
      } else if (cell === sequence[click]) {
        setScore(score + 1)
        setClick(click + 1)
      } else {
        setMisClicked(cell)
        setOpen(true)
        setResult("F A I L E D !")
      }
    },
    [board]
  )

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
      <Header title="Noid - Crypto Security" />
      <Description desc={noidDescription} />
      <section className="flex flex-1 flex-col items-center gap-4 w-full p-2">
        {loading && <Skeleton className="rounded-lg w-[30rem] h-[30rem]" />}
        {!loading && (
          <div className="flex flex-col items-center bg-muted rounded-lg w-[30rem] h-[30rem]">
            <div className="flex w-full h-full flex-col justify-evenly">
              {board.map((row, i) => (
                <div
                  key={`row-${i}`}
                  className="flex flex-row items-center justify-evenly">
                  {row.map((col, j) => (
                    <div
                      key={`cell-${i}-${j}`}
                      className={`flex border rounded-sm items-center justify-center w-16 h-16 font-semibold text-lg text-teal-400 hover:bg-teal-800 hover:cursor-pointer ${
                        score > 0 &&
                        sequence.slice(0, score).includes(col) &&
                        "bg-teal-800"
                      } ${col === misClicked && "bg-red-800 text-red-400"} ${
                        result !== "" && "pointer-events-none"
                      }`}
                      onClick={() => handleBoxClick(col)}>
                      {col}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        {loading && <Skeleton className="rounded-lg w-[30rem] h-[4rem]" />}
        {!loading && (
          <div className="flex flex-col items-start gap-2 w-[30rem] h-[4rem]">
            <div className="text-sm text-red-500 uppercase font-lght">
              {sequence.length > 0 && `// sequence required to access`}
            </div>
            <div className="flex flex-row gap-1">
              {sequence.map((el, i) => (
                <div
                  key={i}
                  className={`flex rounded-sm items-center justify-center ${
                    score > 0 && i < score
                      ? "text-teal-400 bg-teal-800"
                      : "text-yellow-500 bg-yellow-800"
                  } bg-opacity-40 uppercase font-light w-8 h-8`}>
                  {el}
                </div>
              ))}
            </div>
          </div>
        )}
        <Button className="w-[16rem] mt-auto" onClick={startGame}>
          Play
        </Button>
      </section>
    </main>
  )
}

export default Noid
