import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/lib/site"

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800"

// A single `User-agent: *` group keeps `/api/` disallowed for every crawler.
// Separate AI groups would override these rules unless they repeated them.
const ROBOTS = `User-agent: *
Allow: /
Disallow: /api/

# AI crawlers welcome (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
# Claude-SearchBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended).

Sitemap: ${siteConfig.url}/sitemap.xml
`

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        return new Response(ROBOTS, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": CACHE_CONTROL,
          },
        })
      },
    },
  },
})
