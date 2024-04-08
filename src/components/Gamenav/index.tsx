import { cn } from "@/lib/utils"
import Link from "next/link"
import { FC } from "react"
import { buttonVariants } from "../ui/button"

type GameNavProps = {
  navpath: string
  done?: boolean
  children: React.ReactNode
}

const GameNav: FC<GameNavProps> = ({ navpath, children, done }) => {
  return (
    <Link
      href={navpath}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        `justify-between border-b-2 ${done && "border-green-400"}`
      )}>
      {children}
    </Link>
  )
}

export default GameNav
