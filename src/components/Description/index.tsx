import { FC } from "react"

type DescriptionProps = {
  desc: string
}

const Description: FC<DescriptionProps> = ({ desc }) => {
  return (
    <section className="flex items-center justify-center text-l font-light text-center whitespace-pre-line">
      {desc}
    </section>
  )
}

export default Description
