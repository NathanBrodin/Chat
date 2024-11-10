import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"

// Create a new ratelimiter, that allows 10 requests per 2 minutes
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "2 m"),
})

export async function rateLimit(identifier: string) {
  const { success, remaining } = await ratelimit.limit(identifier)

  return { success, remaining }
}
