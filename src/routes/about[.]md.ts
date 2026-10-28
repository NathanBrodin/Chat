import { createFileRoute } from "@tanstack/react-router"

import { aboutMarkdown } from "@/content/pages"

export const Route = createFileRoute("/about.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(aboutMarkdown, {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }),
    },
  },
})
