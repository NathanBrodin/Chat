import {
  CircleAlertIcon,
  CircleCheckIcon,
  LoaderCircleIcon,
} from "lucide-react"

export function StatusIcon({ status }: { status?: "running" | "error" }) {
  if (status === "running") {
    return <LoaderCircleIcon className="animate-spin" />
  }

  if (status === "error") {
    return <CircleAlertIcon />
  }

  return <CircleCheckIcon />
}
