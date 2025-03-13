"use client"

import { useEffect, useState } from "react"

export function useVibration() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // If you need to import the module only on the client side,
    // do it inside useEffect
    if (typeof window !== "undefined") {
      import("ios-vibrator-pro-max").catch(console.error)
    }
  }, [])

  return (duration = 50) => {
    if (isClient && navigator?.vibrate) {
      navigator.vibrate(duration)
    }
  }
}
