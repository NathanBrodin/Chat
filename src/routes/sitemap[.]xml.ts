import { createFileRoute } from "@tanstack/react-router"

import { absoluteUrl, PAGES } from "@/config/site"

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
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        })
      },
    },
  },
})

function escapeXml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  }

  return value.replace(/[&<>"']/g, (character) => entities[character])
}
