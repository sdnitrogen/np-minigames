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
import { thermalFuseDescription } from "@/constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { generateBoard } from "./helper"
import { ThermalFuseTile } from "@/types/ThermalFuseTile"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Banana,
  Bear,
  Bird,
  Claw,
  Frog,
  Monkey,
  Rat,
  Tree,
  Wolf,
} from "@/icons"

const iconBag = [
  ["bird", "frog", "rat"],
  ["bear", "monkey", "claw"],
  ["tree", "wolf", "banana"],
]

const SameGame = () => {
  const row = 6
  const col = 6
  const fullTime = 45
  const [iconSet, setIconSet] = useState<string[]>(iconBag[0])
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(0)
  const [result, setResult] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [progress, setProgress] = useState(100)
  const [loading, setLoading] = useState(false)
  const [solvable, setSolvable] = useState(true)
  const [combo, setCombo] = useState(0)
  const [lastIcon, setLastIcon] = useState("")
  const [lastIcons, setLastIcons] = useState<string[]>([])
  const [comboText, setComboText] = useState("")
  const [targetScore, setTargetScore] = useState(24)
  const [board, setBoard] = useState<ThermalFuseTile[][]>([])

  useEffect(() => {
    if (combo === 3) {
      setComboText("CRC BYPASSED!")
      setScore(score + 2)
      setTimeout(() => {
        setComboText("")
      }, 1000)
    }
    if (combo === 6) {
      setComboText("2X CRC BYPASSED!")
      setScore(score + 4)
      setTimeout(() => {
        setComboText("")
      }, 1000)
    }
    if (lastIcons.length === 3) {
      setComboText("TRIPLE DATA LINK!")
      setScore(score + 3)
      setTimeout(() => {
        setComboText("")
      }, 1000)
    }
  }, [combo, lastIcons.length, setComboText])

  useEffect(() => {
    if (score === targetScore) {
      setOpen(true)
      setResult("S U C C E S S !")
    }
    if (!solvable) {
      setBoard(
        board.map((r) =>
          r.map((c) => {
            c.color = c.color !== "" ? "r" : ""
            return c
          })
        )
      )
      setOpen(true)
      setResult("F A I L E D !")
    }
  }, [score, solvable])

  useEffect(() => {
    if (timeLeft > 0 && result === "") {
      const reducedTime = timeLeft - 0.1
      setTimeout(() => {
        setTimeLeft(reducedTime)
        setProgress((reducedTime / fullTime) * 100)
      }, 100)
    } else if (progress <= 0 && result === "") {
      setBoard(
        board.map((r) =>
          r.map((c) => {
            c.color = c.color !== "" ? "r" : ""
            return c
          })
        )
      )
      setOpen(true)
      setResult("F A I L E D !")
    }
  }, [timeLeft])

  const startGame = () => {
    setSolvable(true)
    const newIconSet = iconBag[Math.floor(Math.random() * 3)]
    setIconSet(newIconSet)
    const generatedBoard = generateBoard(row, col, newIconSet)
    setBoard(generatedBoard)
    setLoading(true)
    setResult("Init")
    setScore(0)
    setCombo(0)
    setLastIcon("")
    setTimeout(() => {
      setResult("")
      setOpen(false)
      setTimeLeft(fullTime)
      setProgress(100)
      setLoading(false)
    }, 3000)
  }

  const handleTileClick = useCallback(
    (x: number, y: number) => {
      if (board[x][y].icon === "") return
      const fBoard = board.map((r) =>
        r.map((c) => {
          c.clickable = "pointer-events-none"
          c.color = c.color !== "" ? c.color.slice(0, -1) + "7" : ""
          return c
        })
      )

      const dfs = (x: number, y: number) => {
        if (
          x < 0 ||
          y < 0 ||
          x > row - 1 ||
          y > col - 1 ||
          fBoard[x][y].icon === ""
        )
          return
        fBoard[x][y].clickable = ""
        fBoard[x][y].color = fBoard[x][y].color.slice(0, -1) + "3"
      }

      if (fBoard[x][y].icon === iconSet[0]) {
        dfs(x + 3, y)
        dfs(x - 3, y)
        dfs(x, y + 3)
        dfs(x, y - 3)
        dfs(x + 3, y + 3)
        dfs(x + 3, y - 3)
        dfs(x - 3, y + 3)
        dfs(x - 3, y - 3)
      }
      if (fBoard[x][y].icon === iconSet[1]) {
        dfs(x + 2, y)
        dfs(x - 2, y)
        dfs(x, y + 2)
        dfs(x, y - 2)
        dfs(x + 2, y + 2)
        dfs(x + 2, y - 2)
        dfs(x - 2, y + 2)
        dfs(x - 2, y - 2)
      }
      if (fBoard[x][y].icon === iconSet[2]) {
        dfs(x + 1, y)
        dfs(x - 1, y)
        dfs(x, y + 1)
        dfs(x, y - 1)
        dfs(x + 1, y + 1)
        dfs(x + 1, y - 1)
        dfs(x - 1, y + 1)
        dfs(x - 1, y - 1)
      }
      const flatBoard = fBoard.flat()
      const clickableTiles = flatBoard.filter(
        (tile) => tile.clickable === ""
      ).length
      if (clickableTiles === 0) setSolvable(false)
      if (fBoard[x][y].clicked === 0) {
        setCombo(0)
        setLastIcon("")
        setLastIcons([])
        fBoard[x][y].clicked += 1
        fBoard[x][y].color = "b7"
        fBoard[x][y].icon = iconSet[Math.floor(Math.random() * 3)]
      } else if (fBoard[x][y].clicked === 1) {
        let curCombo = combo
        if (lastIcon === "" || lastIcon !== fBoard[x][y].icon) {
          lastIcons.includes(fBoard[x][y].icon)
            ? setLastIcons([fBoard[x][y].icon])
            : setLastIcons([...lastIcons, fBoard[x][y].icon])
          setLastIcon(fBoard[x][y].icon)
          setCombo(1)
        } else if (lastIcon === fBoard[x][y].icon) {
          curCombo += 1
          setCombo(curCombo)
        }
        fBoard[x][y].clicked += 1
        fBoard[x][y].color = ""
        fBoard[x][y].icon = ""
        setScore(score + 1)
      }
      setBoard(fBoard)
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
      <Header title="Thermal Fuse - Maze bank" />
      <Description desc={thermalFuseDescription} />
      <section className="flex flex-1 flex-col items-center justify-center gap-4 w-full">
        <div className="flex flex-row items-center justify-between gap-2 w-[30rem] mt-auto px-2">
          <Select
            defaultValue={targetScore.toString()}
            onValueChange={(val: string) => setTargetScore(Number(val))}>
            <Label>Target Score : </Label>
            <SelectTrigger className="w-32 mr-auto">
              <SelectValue placeholder="Select target Score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="28">28</SelectItem>
            </SelectContent>
          </Select>
          {score} / {targetScore}
        </div>
        {loading && <Skeleton className="rounded-lg w-[30rem] h-[31rem]" />}
        {!loading && (
          <div className="flex flex-col items-center bg-muted rounded-lg w-[30rem] h-[31rem]">
            <div className="flex flex-col">
              {board.map((row, i) => (
                <div key={`row-${i}`} className="flex flex-row">
                  {row.map((tile, j) => (
                    <div
                      key={`cell-${i}-${j}`}
                      className={`flex items-center justify-center border-2 w-20 h-20 ${
                        tile.color === "g7" && "bg-[#045b4a]"
                      } ${
                        tile.color === "g3" && "bg-green-400 animate-pulse"
                      } ${tile.color === "b7" && "bg-gray-600"} ${
                        tile.color === "b3" && "bg-gray-300 animate-pulse"
                      } ${tile.color === "r" && "bg-red-800"} ${
                        tile.clickable
                      } ${result !== "" && "pointer-events-none"}`}
                      onClick={() => handleTileClick(i, j)}>
                      {tile.icon === "bird" && <Bird className="h-10 w-10" />}
                      {tile.icon === "frog" && <Frog className="h-10 w-10" />}
                      {tile.icon === "rat" && <Rat className="h-10 w-10" />}
                      {tile.icon === "bear" && <Bear className="h-10 w-10" />}
                      {tile.icon === "monkey" && (
                        <Monkey className="h-10 w-10" />
                      )}
                      {tile.icon === "claw" && <Claw className="h-10 w-10" />}
                      {tile.icon === "tree" && <Tree className="h-10 w-10" />}
                      {tile.icon === "wolf" && <Wolf className="h-10 w-10" />}
                      {tile.icon === "banana" && (
                        <Banana className="h-10 w-10" />
                      )}
                    </div>
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
        <div className="flex items-center justify-center h-8 text-2xl ease-in-out">
          {comboText}
        </div>
        <Button className="w-[16rem] mt-auto" onClick={startGame}>
          Play
        </Button>
      </section>
    </main>
  )
}

export default SameGame
