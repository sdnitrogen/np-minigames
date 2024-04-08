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
import { sameGameDescription } from "@/constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { rotateLeft, rotateRight } from "@/lib/utils"

const generateBoard = (row: number, col: number) => {
  const board = Array(row)
    .fill(null)
    .map(() =>
      Array(col)
        .fill(null)
        .map(() => "rgb".split("")[Math.floor(Math.random() * 3)])
    )
  return board
}

const SameGame = () => {
  const row = 8
  const col = 11
  const fullTime = 25
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [progress, setProgress] = useState(100)
  const [loading, setLoading] = useState(false)
  const [board, setBoard] = useState<string[][]>([])

  useEffect(() => {
    const flatBoard = board.flat()

    const blankBoxes = flatBoard.filter((box) => box === "").length
    if (blankBoxes === row * col) {
      setOpen(true)
      setResult("S U C C E S S !")
    }
  }, [board])

  useEffect(() => {
    if (timeLeft > 0 && result === "") {
      const reducedTime = timeLeft - 0.1
      setTimeout(() => {
        setTimeLeft(reducedTime)
        setProgress((reducedTime / fullTime) * 100)
      }, 100)
    } else if (progress <= 0 && result === "") {
      setOpen(true)
      setResult("F A I L E D !")
    }
  }, [timeLeft])

  const startGame = () => {
    const generatedBoard = generateBoard(row, col)
    setBoard(generatedBoard)
    setLoading(true)
    setResult("Init")
    setTimeout(() => {
      setResult("")
      setOpen(false)
      setTimeLeft(fullTime)
      setProgress(100)
      setLoading(false)
    }, 3000)
  }

  const refreshBoard = (grid: string[][], x: number, y: number) => {
    const adjacentBoxes = getAdjacentBoxes(grid, x, y)
    if (adjacentBoxes.length === 1) return grid
    adjacentBoxes.forEach((box) => {
      grid[box[0]][box[1]] = ""
    })
    const reFreshedBoard = reOrder(grid)
    return reFreshedBoard
  }

  const reOrder = (grid: string[][]) => {
    const bottomPadded = rotateRight(grid).map((arr) =>
      arr.filter((box) => box !== "").concat(arr.filter((box) => box === ""))
    )
    const blankRows = bottomPadded.filter((row) =>
      row.every((cell) => cell === "")
    )
    return rotateLeft(
      bottomPadded.filter((row) => !blankRows.includes(row)).concat(blankRows)
    )
  }

  const getAdjacentBoxes = (grid: string[][], initX: number, initY: number) => {
    const visited = [...Array(row)].map((_) => Array(col).fill(false))
    const adjacentBoxes: number[][] = []
    const color = grid[initX][initY]

    const dfs = (x: number, y: number) => {
      if (
        x < 0 ||
        y < 0 ||
        x > row - 1 ||
        y > col - 1 ||
        visited[x][y] ||
        grid[x][y] !== color
      )
        return
      adjacentBoxes.push([x, y])
      visited[x][y] = true

      dfs(x + 1, y)
      dfs(x, y - 1)
      dfs(x - 1, y)
      dfs(x, y + 1)
    }

    dfs(initX, initY)
    return adjacentBoxes
  }

  const handleBoxClick = useCallback(
    (x: number, y: number) => {
      if (board[x][y] === "") return
      setBoard(refreshBoard(board, x, y))
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
      <Header title="Same Game - Roof Running" />
      <Description desc={sameGameDescription} />
      <section className="flex flex-1 flex-col items-center gap-4 w-full p-2">
        {loading && <Skeleton className="rounded-lg w-[44rem] h-[33rem]" />}
        {!loading && (
          <div className="flex flex-col items-center bg-muted rounded-lg w-[44rem] h-[33rem]">
            <div className="flex flex-col">
              {board.map((row, i) => (
                <div key={`row-${i}`} className="flex flex-row">
                  {row.map((col, j) => (
                    <div
                      key={`cell-${i}-${j}`}
                      className={`border w-16 h-16 ${
                        col === "r" && "bg-red-500"
                      } ${col === "g" && "bg-green-400"} ${
                        col === "b" && "bg-cyan-500"
                      } ${result !== "" && "pointer-events-none"}`}
                      onClick={() => handleBoxClick(i, j)}
                    />
                  ))}
                </div>
              ))}
            </div>
            <Progress
              value={progress}
              className="w-full mt-auto border rounded-none"
            />
          </div>
        )}
        <Button className="w-[16rem] mt-auto" onClick={startGame}>
          Play
        </Button>
      </section>
    </main>
  )
}

export default SameGame
