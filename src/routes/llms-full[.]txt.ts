import { createFileRoute } from "@tanstack/react-router"

import { buildLlmsContent } from "@/lib/llms"

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: () => {
        return new Response(buildLlmsContent(true), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        })
      },
    },
  },
})
