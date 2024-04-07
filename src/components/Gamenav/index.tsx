import { cn } from "@/lib/utils"
import Link from "next/link"
import { FC } from "react"
import { buttonVariants } from "../ui/button"

type GameNavProps = {
  navpath: string
  children: React.ReactNode
}

const GameNav: FC<GameNavProps> = ({ navpath, children }) => {
  return (
    <Link
      href={navpath}
      className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}>
      {children}
    </Link>
  )
}

export default GameNav
