"use no memo"

import "@takumi-rs/helpers/jsx"
import { DAZZLE_STAR_PATH } from "@/components/dazzle/star"
import { siteConfig } from "@/config/site"

export type OgImageProps = {
  title?: string
  description?: string
}

export const OG_LOGO_SRC = "og-logo"

// Matches the hover sparkles in the chat empty state. Their fill and stroke are
// literal because Takumi rasterizes inline SVGs without the card's CSS variables.
const STARS = [
  { left: "0%", top: "20%", size: "0.55em" },
  { left: "15%", top: "80%", size: "0.625em" },
  { left: "45%", top: "40%", size: "0.55em" },
  { left: "75%", top: "60%", size: "0.45em" },
  { left: "100%", top: "30%", size: "0.4em" },
] as const

export function OgImage({ title, description }: OgImageProps) {
  if (!title && !description) {
    return (
      <div tw="flex h-full w-full bg-background p-8">
        <div tw="flex h-full w-full flex-col justify-between items-center rounded-[28px] border border-border bg-card p-14 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div tw="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            <div tw="relative flex items-center justify-center font-heading text-[104px] leading-none font-semibold text-foreground">
              {STARS.map((star) => (
                <svg
                  key={`${star.left}-${star.top}`}
                  viewBox="0 0 96 96"
                  tw="absolute"
                  fill="#fafafa"
                  stroke="#262626"
                  strokeWidth={1}
                  style={{
                    width: star.size,
                    height: star.size,
                    top: star.top,
                    left: star.left,
                    translate: "-50% -50%",
                  }}
                >
                  <path d={DAZZLE_STAR_PATH} />
                </svg>
              ))}
              <span tw="relative z-10">{siteConfig.name}</span>
            </div>
            <p tw="m-0 font-sans text-[26px] leading-[1.5] text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <span tw="font-mono text-[18px] leading-none text-muted-foreground">
            {siteConfig.url.replace("https://", "")}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div tw="flex h-full w-full bg-background p-8">
      <div tw="flex h-full w-full flex-col justify-between rounded-[28px] border border-border bg-card p-14 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div tw="flex items-center gap-2.5">
          <img src={OG_LOGO_SRC} alt="" tw="h-9 w-9 text-primary" />
          <span tw="font-heading text-[28px] leading-none font-semibold text-foreground">
            {siteConfig.name}
          </span>
        </div>

        <div tw="flex flex-col gap-6">
          <h1 tw="m-0 max-w-[920px] font-display text-[72px] leading-[0.95] font-semibold tracking-[-0.04em] text-foreground line-clamp-2">
            {title ?? siteConfig.title}
          </h1>
          <p tw="m-0 max-w-[820px] font-sans text-2xl leading-[1.4] text-muted-foreground line-clamp-3">
            {description ?? siteConfig.description}
          </p>
        </div>

        <div tw="flex items-center justify-end">
          <span tw="font-mono text-[18px] leading-none text-muted-foreground">
            {siteConfig.url.replace("https://", "")}
          </span>
        </div>
      </div>
    </div>
  )
}
