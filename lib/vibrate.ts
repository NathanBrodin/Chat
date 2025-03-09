"use client"

import "ios-vibrator-pro-max"

export function vibrate(duration = 50) {
  if (navigator) {
    navigator.vibrate(duration)
  }
}
