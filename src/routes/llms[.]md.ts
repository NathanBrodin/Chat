import { createFileRoute } from "@tanstack/react-router"

import { buildLlmsContent } from "@/lib/llms"

export const Route = createFileRoute("/llms.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildLlmsContent(false), {
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        }),
    },
  },
})
