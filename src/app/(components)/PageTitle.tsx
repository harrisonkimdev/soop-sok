import type { JSX } from "react"

type PageTitleProps = {
  title: string
  className?: string
}
const PageTitle = ({ title, className }: PageTitleProps): JSX.Element => {
  return (
    <h1 className="mb-2 text-center text-lg font-semibold capitalize text-slate-300">
      {title}
    </h1>
  )
}

export default PageTitle
