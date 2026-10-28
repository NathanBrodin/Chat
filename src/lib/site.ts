import geistMonoFontUrl from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url"
import calSansFontUrl from "cal-sans/fonts/calsans-var-full/CalSansVF.woff2?url"
import type { JSX } from "react"

export const siteConfig = {
  url: "https://chat.brodin.dev",
  name: "Nathan's AI",
  title: "Nathan's AI | Ask Nathan Brodin Anything",
  description:
    "An interactive AI portfolio that answers questions about Nathan Brodin's experience, projects, and approach to building fast, accessible products for the web.",
  keywords: [
    "Nathan Brodin",
    "AI portfolio",
    "chat with my portfolio",
    "interactive portfolio",
    "frontend engineer",
    "AI chat",
    "TanStack Start",
    "TypeScript",
  ],
  author: "Nathan Brodin",
  authorUrl: "https://brodin.dev",
  portfolioUrl: "https://brodin.dev",
  portfolioLlmsUrl: "https://brodin.dev/llms.txt",
  portfolioLlmsFullUrl: "https://brodin.dev/llms-full.txt",
  resumeUrl: "https://brodin.dev/resume",
  githubUrl: "https://github.com/NathanBrodin/Chat",
  githubRepo: "NathanBrodin/Chat",
  linkedinUrl: "https://linkedin.com/in/nathan-brodin",
  xUrl: "https://x.com/nathan_brodin",
  email: "nathan@brodin.dev",
  // Kept in sync with the canonical Person entity on brodin.dev.
  sameAs: [
    "https://github.com/NathanBrodin",
    "https://linkedin.com/in/nathan-brodin",
    "https://twitter.com/nathan_brodin",
    "https://medium.com/@nathan-brodin",
    "https://dev.to/nathan-brodin",
    "https://peerlist.io/brodin",
    "https://www.figma.com/@nathanbrodin",
  ],
  themeColors: {
    light: "#fafafa",
    dark: "#09090b",
  },
} as const

export const PERSON_ID = "https://brodin.dev/#person"
export const WEBSITE_ID = "https://chat.brodin.dev/#website"
export const APP_ID = "https://chat.brodin.dev/#app"
export const SOURCE_ID = "https://chat.brodin.dev/#source"

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString()
}

export function ogImageUrl({ title, description }: { title?: string; description?: string }) {
  const params = new URLSearchParams()
  if (title) {
    params.set("title", title)
  }
  if (description) {
    params.set("description", description)
  }
  const query = params.toString()
  return query ? `${siteConfig.url}/og?${query}` : `${siteConfig.url}/og`
}

export function getRootHead(): {
  meta: JSX.IntrinsicElements["meta"][]
  links: JSX.IntrinsicElements["link"][]
} {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "application-name", content: siteConfig.name },
      { name: "color-scheme", content: "light dark" },
      { name: "author", content: siteConfig.author },
      { name: "creator", content: siteConfig.author },
      { name: "publisher", content: siteConfig.author },
      // Updated before paint by the theme boot script, so one meta is enough.
      { name: "theme-color", content: siteConfig.themeColors.light },
    ],
    links: [
      { rel: "author", href: siteConfig.authorUrl },
      { rel: "describedby", href: absoluteUrl("/llms.txt") },
      {
        rel: "preload",
        href: calSansFontUrl,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: geistMonoFontUrl,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "icon", type: "image/x-icon", sizes: "32x32", href: "/favicon.ico" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
  }
}
