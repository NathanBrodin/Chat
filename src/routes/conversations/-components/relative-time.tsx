import { useEffect, useState } from "react"

import { formatRelativeTime } from "@/lib/chat/utils"

export function RelativeTime({ date }: { date: Date }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    // The server and client can land on different sides of a time unit.
    <time dateTime={date.toISOString()} suppressHydrationWarning>
      {formatRelativeTime(date, now)}
    </time>
  )
}
