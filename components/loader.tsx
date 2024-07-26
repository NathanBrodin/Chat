import { LoaderIcon } from "lucide-react"

type LoaderProps = {
  content?: string
}

export function Loader({ content = "Thinking..." }: LoaderProps) {
  return (
    <div className="flex items-center">
      <div className="animate-pulse">{content}</div>
      <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />
    </div>
  )
}
