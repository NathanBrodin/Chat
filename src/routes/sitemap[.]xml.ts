import { createFileRoute } from "@tanstack/react-router"

import { PAGES } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"

const CACHE_CONTROL = "public, s-maxage=86400, stale-while-revalidate=604800"

const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => XML_ENTITIES[character])
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = Object.values(PAGES)
          .map((page) =>
            [
              "  <url>",
              `    <loc>${escapeXml(absoluteUrl(page.path))}</loc>`,
              `    <lastmod>${escapeXml(page.lastModified)}</lastmod>`,
              `    <changefreq>${page.changefreq}</changefreq>`,
              `    <priority>${page.priority}</priority>`,
              "  </url>",
            ].join("\n"),
          )
          .join("\n")

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": CACHE_CONTROL,
          },
        })
      },
    },
  },
})
