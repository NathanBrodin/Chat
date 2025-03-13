"use client"

import { useEffect, useState } from "react"
import "ios-vibrator-pro-max"

export function useVibration() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (duration = 50) => {
    if (isClient && navigator?.vibrate) {
      navigator.vibrate(duration)
    }
  }
}
