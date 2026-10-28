import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site"

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: () => {
        const manifest = {
          id: "/",
          name: "Nathan's AI · Nathan Brodin",
          short_name: "Nathan's AI",
          description: siteConfig.description,
          start_url: "/",
          scope: "/",
          display: "minimal-ui",
          theme_color: "#09090b",
          background_color: "#09090b",
          lang: "en",
          dir: "ltr",
          categories: ["portfolio", "productivity"],
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            {
              src: "/icons/icon-maskable-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: "/icons/icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        }

        return new Response(JSON.stringify(manifest, null, 2), {
          headers: {
            "Content-Type": "application/manifest+json; charset=utf-8",
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        })
      },
    },
  },
})
