import { Geo } from "@vercel/edge"
import { type ClassValue, clsx } from "clsx"
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
