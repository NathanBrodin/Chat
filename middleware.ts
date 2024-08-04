import { geolocation } from "@vercel/edge"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { nextUrl: url } = request
  const geo = geolocation(request)

  /** The city that the request originated from. */
  const city: string = geo.city || "Unknown"

  /** The country that the request originated from. */
  const country: string = geo.country || "Unknown"

  /** The flag emoji for the country the request originated from. */
  const flag: string = geo.flag || "🏳️"

  /** The [Vercel Edge Network region](https://vercel.com/docs/concepts/edge-network/regions) that received the request. */
  const region: string = geo.region || "Unknown"

  /** The region part of the ISO 3166-2 code of the client IP.
   * See [docs](https://vercel.com/docs/concepts/edge-network/headers#x-vercel-ip-country-region).
   */
  const countryRegion: string = geo.countryRegion || "Unknown"

  /** The latitude of the client. */
  const latitude: string = geo.latitude || "0"

  /** The longitude of the client. */
  const longitude: string = geo.longitude || "0"

  url.searchParams.set("city", city)
  url.searchParams.set("country", country)
  url.searchParams.set("flag", flag)
  url.searchParams.set("region", region)
  url.searchParams.set("countryRegion", countryRegion)
  url.searchParams.set("latitude", latitude)
  url.searchParams.set("longitude", longitude)

  return NextResponse.rewrite(url)
}

// Run only on homepage
export const config = {
  matcher: "/",
}
