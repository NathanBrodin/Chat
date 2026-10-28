import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site"

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () => {
        const robots = `User-agent: *
Allow: /
Disallow: /api/

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
