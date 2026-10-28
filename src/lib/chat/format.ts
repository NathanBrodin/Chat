const relativeTimeFormat = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

const RELATIVE_TIME_UNITS: ReadonlyArray<readonly [Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
  ["second", 1_000],
]

export function formatRelativeTime(date: Date, now: Date) {
  const diff = date.getTime() - now.getTime()

  for (const [unit, ms] of RELATIVE_TIME_UNITS) {
    if (Math.abs(diff) >= ms) {
      return relativeTimeFormat.format(Math.round(diff / ms), unit)
    }
  }

  return relativeTimeFormat.format(0, "second")
}
