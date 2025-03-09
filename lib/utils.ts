import { Geo } from "@vercel/edge"
import { type ClassValue, clsx } from "clsx"
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type searchParams = { [key: string]: string | string[] | undefined }

export function searchParamsToGeo(searchParams: searchParams) {
  const location: Geo = {
    city: searchParams.city as string,
    country: searchParams.country as string,
    flag: searchParams.flag as string,
    region: searchParams.region as string,
    countryRegion: searchParams.countryRegion as string,
    latitude: searchParams.latitude as string,
    longitude: searchParams.longitude as string,
  }
  return location
}

export function getCountryName(countryCode: string | null) {
  if (!countryCode) return ""

  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
    return regionNames.of(countryCode)
  } catch {
    return countryCode // fallback to code if translation fails
  }
}

// Helper function to get date range based on selection
export function getDateRange(dateRangeValue: string) {
  const now = new Date()

  switch (dateRangeValue) {
    case "today":
      return { start: startOfDay(now), end: endOfDay(now) }
    case "yesterday":
      const yesterday = subDays(now, 1)
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) }
    case "this-week":
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
    case "last-week":
      const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
      const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 })
      return { start: lastWeekStart, end: lastWeekEnd }
    case "this-month":
      return { start: startOfMonth(now), end: endOfMonth(now) }
    case "last-month":
      const lastMonth = subMonths(now, 1)
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) }
    case "this-year":
      return { start: startOfYear(now), end: endOfYear(now) }
    case "last-year":
      const lastYear = subYears(now, 1)
      return { start: startOfYear(lastYear), end: endOfYear(lastYear) }
    default:
      return null
  }
}
