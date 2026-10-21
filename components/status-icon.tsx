import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"
import { Spinner } from "./ui/spinner"

export function StatusIcon({ status }: { status?: "running" | "error" }) {
  if (status === "running") {
    return <Spinner />
  }

  if (status === "error") {
    return <CircleAlertIcon />
  }

  return <CircleCheckIcon />
}
