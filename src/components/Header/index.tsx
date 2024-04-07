import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import { Github } from "lucide-react"

type HeaderProps = {
  title: string
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <section className="flex w-full flex-row items-center justify-center text-3xl font-semibold">
      <Link href="/" className="absolute left-8">
        <Image
          src="/nopixel-logo.png"
          width={60}
          height={60}
          alt="nopixel-logo"
        />
      </Link>
      <div className="border-b border-primary pb-2 px-8">{title}</div>
      <Link
        href="https://github.com/sdnitrogen/np-minigames"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "absolute right-8"
        )}>
        <Github className="h-6 w-6" />
      </Link>
    </section>
  )
}

export default Header
