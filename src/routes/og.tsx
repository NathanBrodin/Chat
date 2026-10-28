import type { CssInput } from "@takumi-rs/helpers"
import type { FontLoader, ImageLoader } from "@takumi-rs/helpers/renderer"
import { createFileRoute } from "@tanstack/react-router"
import { createElement } from "react"
import z from "zod"

import { OG_STAR_SRC, OG_STAR_SVG, OgImage } from "@/components/og-image"
import { siteConfig } from "@/lib/site"

const MAX_TITLE_LENGTH = 120
const MAX_DESCRIPTION_LENGTH = 240

// Raw values are bounded so a request cannot carry unbounded work; rendering
// clamps them to the lengths the card can show.
const ogSearchSchema = z.object({
  title: z.string().max(1024).optional(),
  description: z.string().max(2048).optional(),
})

const namedHtmlEntities = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
} as const

export const Route = createFileRoute("/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { ImageResponse } = await import("takumi-js/response")

        const url = new URL(request.url)
        const parsed = ogSearchSchema.safeParse(Object.fromEntries(url.searchParams.entries()))

        if (!parsed.success) {
          return new Response("Invalid search parameters", { status: 400 })
        }

        const title = clampText(
          decodeHtmlEntities(parsed.data.title) ?? siteConfig.title,
          MAX_TITLE_LENGTH,
        )
        const description = clampText(
          decodeHtmlEntities(parsed.data.description) ?? siteConfig.description,
          MAX_DESCRIPTION_LENGTH,
        )
        const { fonts, images } = await loadOgAssets(url.origin)

        return new ImageResponse(createElement(OgImage, { title, description }), {
          width: 1200,
          height: 630,
          fonts,
          images,
          fontFamilies: ["Cal Sans", "Geist Mono"],
          css: OG_CSS,
          headers: {
            "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        })
      },
    },
  },
})

// Flat values from the dark theme in src/styles.css: Takumi does not resolve var() inside custom property values.
const OG_CSS: CssInput[] = [
  '@import "tailwindcss";',
  {
    selector: ":root",
    style: {
      "--font-sans": "'Cal Sans'",
      "--font-display": "'Cal Sans'",
      "--font-mono": "'Geist Mono'",
      "--color-background": "#09090b",
      "--color-foreground": "#f5f5f5",
      "--color-primary": "#f5f5f5",
      "--color-muted-foreground": "#a1a1a1",
      "--color-border": "rgba(255, 255, 255, 0.08)",
    },
  },
]

function decodeHtmlEntities(value: string | undefined) {
  if (!value) return

  return value.replace(/&(#(?:x[a-f\d]+|\d+)|[a-z]+);/gi, (entity, body: string) => {
    if (body.startsWith("#")) {
      const isHex = body[1]?.toLowerCase() === "x"
      const rawCodePoint = body.slice(isHex ? 2 : 1)
      const codePoint = Number.parseInt(rawCodePoint, isHex ? 16 : 10)

      if (Number.isNaN(codePoint)) {
        return entity
      }

      try {
        return String.fromCodePoint(codePoint)
      } catch {
        return entity
      }
    }

    const namedEntity = namedHtmlEntities[body.toLowerCase() as keyof typeof namedHtmlEntities]

    return namedEntity ?? entity
  })
}

function clampText(value: string, maxLength: number) {
  const normalized = value
    .replace(/\p{Cc}/gu, " ")
    .replace(/\s+/g, " ")
    .trim()

  if (normalized.length <= maxLength) return normalized

  const truncated = normalized.slice(0, maxLength - 1)
  const lastSpace = truncated.lastIndexOf(" ")
  const body = lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated

  return `${body.trimEnd()}…`
}

async function fetchBytes(origin: string, path: string): Promise<ArrayBuffer> {
  const response = await fetch(new URL(path, origin))
  if (!response.ok) {
    throw new Error(`OG asset request failed: ${response.status} ${path}`)
  }
  return response.arrayBuffer()
}

type OgAssets = {
  fonts: FontLoader[]
  images: ImageLoader[]
}

// Resolved once per server instance; the bytes are identical across origins.
let cachedAssets: Promise<OgAssets> | null = null

function loadOgAssets(origin: string): Promise<OgAssets> {
  cachedAssets ??= Promise.all([
    fetchBytes(origin, "/fonts/CalSansVF.woff2"),
    fetchBytes(origin, "/fonts/geist-mono-latin-wght-normal.woff2"),
  ])
    .then(([calSans, geistMono]): OgAssets => {
      return {
        fonts: [
          { name: "Cal Sans", data: calSans },
          { name: "Geist Mono", data: geistMono },
        ],
        images: [{ src: OG_STAR_SRC, data: new TextEncoder().encode(OG_STAR_SVG) }],
      }
    })
    .catch((error: unknown) => {
      cachedAssets = null
      throw error
    })
  return cachedAssets
}
