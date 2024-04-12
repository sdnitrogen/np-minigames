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
import { laptopTerminalDescription } from "@/constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import _ from "lodash"
import { Input } from "@/components/ui/input"
import { ChevronRight, Circle, Square, Triangle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Laptop4Sequence } from "@/types/Laptop4Sequence"
import { Progress } from "@/components/ui/progress"

/*
Easy : 4 seq -> 2 shapes each (same color per seq) -> 3 questions -> prep = 12, answer = 12
Hard: 4 seq -> 3 shapes each (same color per seq) -> 4 question -> prep = 6, answer = 9

Shapes : Square, circle, triangle
Colors : red, blue, yellow, purple, orange, green

Questions:
seq x shape x
seq x color
seq x # of unique shapes
*/

const colorOptions = ["red", "blue", "yellow", "purple", "orange", "green"]
const shapeOptions = ["square", "circle", "triangle"]

const generateAnswerOptions = (row: number, col: number) => {
  const answerOptions = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      answerOptions.push([i.toString(), j.toString()])
    }
    answerOptions.push([i.toString(), "color"])
    answerOptions.push([i.toString(), "#"])
  }
  return answerOptions
}

const generateShapesBoard = (row: number, col: number): Laptop4Sequence[] => {
  const array: string[] = []
  while (array.length < row * col) {
    array.push(shapeOptions[Math.floor(Math.random() * shapeOptions.length)])
  }

  const board: Laptop4Sequence[] = []
  while (array.length)
    board.push({
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      shapes: array.splice(0, col),
    })
  return board
}

const generateQuestionSet = (
  board: Laptop4Sequence[],
  quesOptions: string[][]
) => {
  const questionSet: { q: string; a: string }[] = []
  quesOptions.forEach((option) => {
    if (option[1] === "color") {
      questionSet.push({
        q: `Sequence ${Number(option[0]) + 1} Color`,
        a: `${board[Number(option[0])].color}`,
      })
    } else if (option[1] === "#") {
      questionSet.push({
        q: `Sequence ${Number(option[0]) + 1} # of unique shapes`,
        a: `${_.uniq(board[Number(option[0])].shapes).length}`,
      })
    } else {
      questionSet.push({
        q: `Sequence ${Number(option[0]) + 1} Shape ${Number(option[1]) + 1}`,
        a: `${board[Number(option[0])].shapes[Number(option[1])]}`,
      })
    }
  })
  return questionSet
}

const compareAnswers = (
  c1: { q: string; a: string }[],
  c2: { q: string; a: string }[]
) => {
  let res = true
  c2.forEach((c, i) => {
    if (c.a !== c1[i].a) res = false
  })
  return res
}

const LaptopTerminal = () => {
  const row = 4
  const [column, setColumn] = useState(2)
  const fullTime: Record<string, number> = {
    "2": 24,
    "3": 15,
  }
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(100)
  const [timeLeft, setTimeLeft] = useState(0)
  const [answerInput, setAnswerInput] = useState<string>("")
  const [shapesBoard, setShapesBoard] = useState<Laptop4Sequence[]>([])
  const [questionSet, setQuestionSet] = useState<{ q: string; a: string }[]>([])
  const [entries, setEntries] = useState<{ q: string; a: string }[]>([])
  const [prepmode, setPrepmode] = useState(true)

  useEffect(() => {
    if (timeLeft > 0 && result === "") {
      const reducedTime = timeLeft - 0.1
      setTimeout(() => {
        setTimeLeft(reducedTime)
        setProgress((reducedTime / fullTime[column.toString()]) * 100)
      }, 100)
      if (column === 2 && timeLeft < 12) {
        setPrepmode(false)
      } else if (column === 3 && timeLeft < 9) {
        setPrepmode(false)
      }
    } else if (progress <= 0 && result === "") {
      setOpen(true)
      setResult("F A I L E D !")
    }
  }, [timeLeft])

  useEffect(() => {
    if (!prepmode) {
      setEntries([{ q: questionSet[0].q, a: "" }])
      inputRef.current?.focus()
    }
  }, [prepmode])

  const startGame = () => {
    const generatedShapesBoard = generateShapesBoard(row, column)
    setShapesBoard(generatedShapesBoard)
    const generatedAnswerOptions = _.shuffle(
      generateAnswerOptions(row, column)
    ).slice(0, column + 1)
    setQuestionSet(
      generateQuestionSet(generatedShapesBoard, generatedAnswerOptions)
    )
    setPrepmode(true)
    setEntries([])
    setLoading(true)
    setResult("Init")
    setTimeout(() => {
      setResult("")
      setOpen(false)
      setLoading(false)
      setTimeLeft(fullTime[column.toString()])
    }, 3000)
  }

  const checkKeyInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitAnswer()
  }

  const submitAnswer = () => {
    if (result !== "" || prepmode) return
    let lastQ = entries[entries.length - 1]
    lastQ.a = answerInput
    const curEntries = [...entries]
    curEntries.splice(curEntries.length - 1, 1, lastQ)
    const comp = compareAnswers(questionSet, curEntries)
    if (comp && curEntries.length === questionSet.length) {
      setOpen(true)
      setResult("S U C C E S S !")
      setEntries(curEntries)
      setAnswerInput("")
    } else if (!comp) {
      setOpen(true)
      setResult("F A I L E D !")
      setEntries(curEntries)
      setAnswerInput("")
    } else {
      setEntries([
        ...curEntries,
        { q: questionSet[curEntries.length].q, a: "" },
      ])
      setAnswerInput("")
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
      <Header title="Laptop - Maze Bank Terminal Hack" />
      <Description desc={laptopTerminalDescription} />
      <section className="flex flex-1 flex-col items-center w-full p-2">
        <div className="flex flex-row items-center justify-between gap-2 w-[48rem] mt-auto px-2">
          <Select
            defaultValue={column.toString()}
            onValueChange={(val: string) => setColumn(Number(val))}>
            <Label>Difficulty : </Label>
            <SelectTrigger className="w-24 mr-auto">
              <SelectValue placeholder="Select diffiulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">Easy</SelectItem>
              <SelectItem value="3">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {loading && <Skeleton className="w-[48rem] h-[36rem]" />}
        {!loading && (
          <div className="flex flex-col items-start border-2 border-muted w-[48rem] h-[36rem]">
            {prepmode &&
              shapesBoard.map((row, i) => (
                <div
                  key={`row-${i}`}
                  className="flex flex-col items-start justify-center gap-2 text-sm font-bold mb-2 px-4 py-1">
                  <span className="text-teal-400">{`SEQUENCE  ${i + 1}`}</span>
                  <div className="flex flex-row items-center gap-8">
                    {row.shapes.map((col, j) => (
                      <div
                        key={`cell-${i}-${j}`}
                        className={`flex w-24 h-24 items-center justify-center`}>
                        {col === "square" && (
                          <Square height={96} width={96} color={row.color} />
                        )}
                        {col === "circle" && (
                          <Circle height={96} width={96} color={row.color} />
                        )}
                        {col === "triangle" && (
                          <Triangle height={96} width={96} color={row.color} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {!prepmode &&
              entries.map((entry, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 fon-semibold text-lg p-4">
                  <div className="text-teal-400">{entry.q}</div>
                  <div>{entry.a}</div>
                </div>
              ))}
            {!prepmode && result !== "" && (
              <div
                className={`${
                  result === "F A I L E D !" ? "text-red-500" : "text-green-500"
                } font-semibold text-lg p-4`}>
                {result === "F A I L E D !"
                  ? `Failed! Expected Answer : ${
                      questionSet[entries.length - 1].a
                    }`
                  : "Success"}
              </div>
            )}
            <Progress
              value={progress}
              className="w-full mt-auto border rounded-none"
            />
          </div>
        )}
        <div className="flex w-[48rem] h-8 flex-row items-start space-x-2">
          <Input
            type="text"
            placeholder="Type  answer  here"
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value.toLowerCase())}
            onKeyUp={(e) => checkKeyInput(e)}
            className="flex-1 rounded-none border-muted-foreground"
            ref={inputRef}
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-none border-muted-foreground hover:text-secondary hover:bg-primary"
            onClick={submitAnswer}>
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

export default LaptopTerminal
