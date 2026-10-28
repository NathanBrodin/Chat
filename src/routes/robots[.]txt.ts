import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site"

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        // A single `User-agent: *` group keeps `/api/` disallowed for every
        // crawler; separate AI groups would override these rules.
        const robots = `User-agent: *
Allow: /
Disallow: /api/

# AI crawlers welcome (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
# Claude-SearchBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended).

Sitemap: ${siteConfig.url}/sitemap.xml
`

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        })
      },
    },
  },
})
