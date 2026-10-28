import { createFileRoute } from "@tanstack/react-router"

import { buildLlmsContent } from "@/lib/llms"

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800"

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () => {
        return new Response(buildLlmsContent(false), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": CACHE_CONTROL,
          },
        })
      },
    },
  },
})
