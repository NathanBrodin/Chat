"use no memo"

import "@takumi-rs/helpers/jsx"
import { siteConfig } from "@/config/site"

export type OgImageProps = {
  title?: string
  description?: string
}

export const OG_STAR_SRC = "og-star"

// Supplied to Takumi as a pre-fetched image so the card stays self-contained.
export function ogStarSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128"><g fill="#f5f5f5">${[
    "M72.88 10.09A3.44 3.44 0 0 1 79.14 10.09L90.82 35.65A1.41 1.41 0 0 0 91.52 36.34L117.08 48.03A3.44 3.44 0 0 1 117.08 54.28L91.52 65.97A1.41 1.41 0 0 0 90.82 66.67L79.14 92.23A3.44 3.44 0 0 1 72.88 92.23L61.19 66.67A1.41 1.41 0 0 0 60.5 65.97L34.94 54.28A3.44 3.44 0 0 1 34.94 48.03L60.5 36.34A1.41 1.41 0 0 0 61.19 35.65Z",
    "M31.22 72.84A1.93 1.93 0 0 1 34.73 72.84L41.29 87.19A0.79 0.79 0 0 0 41.68 87.58L56.04 94.14A1.93 1.93 0 0 1 56.04 97.65L41.68 104.22A0.79 0.79 0 0 0 41.29 104.61L34.73 118.96A1.93 1.93 0 0 1 31.22 118.96L24.66 104.61A0.79 0.79 0 0 0 24.27 104.22L9.92 97.65A1.93 1.93 0 0 1 9.92 94.14L24.27 87.58A0.79 0.79 0 0 0 24.66 87.19Z",
  ]
    .map((path) => `<path d="${path}"/>`)
    .join("")}</g></svg>`
}

export function OgImage({ title, description }: OgImageProps) {
  const heading = title ?? siteConfig.title
  const summary = description ?? siteConfig.description

  return (
    <div tw="relative flex h-full w-full flex-col justify-between overflow-hidden bg-background p-16">
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(135deg, rgba(245, 245, 245, 0.07), transparent 55%)",
        }}
      />
      <div tw="relative flex w-full flex-row items-center justify-between">
        <div tw="flex flex-row items-center gap-4">
          <img src={OG_STAR_SRC} style={{ width: 44, height: 44 }} alt="" />
          <span tw="font-display text-3xl font-medium text-foreground">{siteConfig.name}</span>
        </div>
        <span tw="font-mono text-2xl text-muted-foreground">
          {siteConfig.url.replace("https://", "")}
        </span>
      </div>

      <div tw="relative flex flex-col gap-5">
        <h1 tw="max-w-[1020px] font-display text-7xl font-medium text-balance text-foreground line-clamp-2">
          {heading}
        </h1>
        <p tw="max-w-[960px] font-sans text-2xl text-muted-foreground line-clamp-3">{summary}</p>
      </div>

      <div tw="relative flex w-full flex-row items-center justify-between border-t border-border pt-6">
        <span tw="font-mono text-xl text-muted-foreground">Ask anything about my work</span>
        <span tw="font-display text-2xl font-medium text-foreground">{siteConfig.author}</span>
      </div>

      <div
        aria-hidden="true"
        tw="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245, 245, 245, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 245, 245, 0.05) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
          maskImage: "linear-gradient(to top, rgba(255, 255, 255, 0.68), transparent)",
        }}
      />
    </div>
  )
}
