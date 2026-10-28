export type ConversationLocation = {
  city: string | null
  country: string | null
  region: string | null
  latitude: number | null
  longitude: number | null
  timezone: string | null
}

function header(request: Request, name: string) {
  return request.headers.get(name)
}

function coordinate(value: string | null): number | null {
  if (value === null) {
    return null
  }
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Reads Vercel's geolocation headers. Every field is null outside the Vercel
 * runtime, where these headers are absent.
 */
export function getLocation(request: Request): ConversationLocation {
  return {
    city: header(request, "x-vercel-ip-city"),
    country: header(request, "x-vercel-ip-country"),
    region: header(request, "x-vercel-ip-country-region"),
    latitude: coordinate(header(request, "x-vercel-ip-latitude")),
    longitude: coordinate(header(request, "x-vercel-ip-longitude")),
    timezone: header(request, "x-vercel-ip-timezone"),
  }
}
