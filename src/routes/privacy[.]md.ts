import { createFileRoute } from "@tanstack/react-router"

import { privacyMarkdown } from "@/content/pages"

export const Route = createFileRoute("/privacy.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(privacyMarkdown, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }),
    },
  },
})
