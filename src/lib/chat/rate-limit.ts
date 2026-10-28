import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

import { chatErrors } from "@/lib/errors/chat"

const burst = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30s"),
  prefix: "chat:burst",
  analytics: true,
})

const daily = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, "24h"),
  prefix: "chat:daily",
  analytics: true,
})

function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip"
}

export async function checkChatRateLimit(request: Request) {
  const ip = getClientIp(request)

  const burstResult = await burst.limit(ip)
  if (!burstResult.success) {
    throw chatErrors.RATE_LIMITED_BURST({
      retryAfter: Math.max(1, Math.ceil((burstResult.reset - Date.now()) / 1000)),
      internal: { limit: burstResult.limit, remaining: burstResult.remaining },
    })
  }

  const dailyResult = await daily.limit(ip)
  if (!dailyResult.success) {
    throw chatErrors.RATE_LIMITED_DAILY({
      retryAfter: Math.max(1, Math.ceil((dailyResult.reset - Date.now()) / 1000)),
      internal: { limit: dailyResult.limit, remaining: dailyResult.remaining },
    })
  }
}
