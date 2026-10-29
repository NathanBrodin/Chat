import { createStart, createMiddleware } from "@tanstack/react-start"

import { aboutMarkdown, privacyMarkdown } from "@/content/pages"
import { buildLlmsContent } from "@/lib/llms"

const markdownPages = new Map([
  ["/", buildLlmsContent(false)],
  ["/about", aboutMarkdown],
  ["/privacy", privacyMarkdown],
])

const markdownNegotiation = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    if (!request.headers.get("accept")?.toLowerCase().includes("text/markdown")) {
      return next()
    }

    const pathname = new URL(request.url).pathname.replace(/\/+$/, "") || "/"
    const markdown = markdownPages.get(pathname)

    if (!markdown) {
      return next()
    }

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Vary: "Accept",
      },
    })
  },
)

export const startInstance = createStart(() => ({
  requestMiddleware: [markdownNegotiation],
}))
