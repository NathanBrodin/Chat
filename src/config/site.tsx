import geistMonoFontUrl from "@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url"
import calSansFontUrl from "cal-sans/fonts/calsans-var-full/CalSansVF.woff2?url"
import type { JSX } from "react"
import type {
  AboutPage,
  BreadcrumbList,
  FAQPage,
  Graph,
  ListItem,
  Person,
  SoftwareSourceCode,
  WebApplication,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts"

export const siteConfig = {
  url: "https://chat.brodin.dev",
  name: "Nathan's AI",
  title: "Nathan's AI · Ask Nathan Brodin Anything",
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

const PERSON_ID = "https://brodin.dev/#person"
const WEBSITE_ID = "https://chat.brodin.dev/#website"
const APP_ID = "https://chat.brodin.dev/#app"
const SOURCE_ID = "https://chat.brodin.dev/#source"

export const PAGES = {
  home: {
    path: "/",
    title: siteConfig.title,
    ogTitle: "Ask my AI anything about Nathan Brodin",
    description: siteConfig.description,
    lastModified: "2026-10-28",
    changefreq: "weekly",
    priority: "1.0",
  },
  about: {
    path: "/about",
    title: "About Nathan's AI · An AI Portfolio by Nathan Brodin",
    ogTitle: "About Nathan's AI",
    description:
      "How Nathan's AI works, what it can answer about Nathan Brodin's experience and projects, and the stack behind this interactive portfolio.",
    lastModified: "2026-10-28",
    changefreq: "monthly",
    priority: "0.8",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy · Nathan's AI",
    ogTitle: "Privacy",
    description:
      "How Nathan's AI handles conversations, cookies, and approximate location, and what stays public when you share a chat.",
    lastModified: "2026-10-28",
    changefreq: "yearly",
    priority: "0.3",
  },
} as const

export type PageKey = keyof typeof PAGES

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

export function buildSeoHead(pageKey: PageKey) {
  const page = PAGES[pageKey]
  const description = truncateDescription(page.description)
  const canonical = absoluteUrl(page.path)
  const image = ogImageUrl({ title: page.ogTitle, description })

  return {
    meta: [
      { title: page.title },
      { name: "description", content: description },
      { name: "keywords", content: siteConfig.keywords.join(", ") },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:title", content: page.title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${page.title} · ${siteConfig.author}` },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@nathan_brodin" },
      { name: "twitter:creator", content: "@nathan_brodin" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: description },
      { name: "twitter:url", content: canonical },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: `${page.title} · ${siteConfig.author}` },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(pageJsonLd(pageKey)),
      },
    ],
  }
}

export function siteJsonLd(): Graph {
  const licenseUrl = `${siteConfig.githubUrl}/blob/main/LICENSE`

  const person: Person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: siteConfig.author,
    url: siteConfig.portfolioUrl,
    image: `${siteConfig.portfolioUrl}/og`,
    jobTitle: "Frontend Engineer",
    sameAs: siteConfig.sameAs,
  }

  const website: WebSite = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    alternateName: "Chat with Nathan Brodin's portfolio",
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  }

  const application: WebApplication = {
    "@type": "WebApplication",
    "@id": APP_ID,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    applicationCategory: "ReferenceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    license: licenseUrl,
    featureList: [
      "Conversational answers about Nathan Brodin's experience and projects",
      "Streaming AI chat with tool calls",
      "Public, shareable conversations",
      "Open-source TypeScript codebase",
    ],
    screenshot: absoluteUrl("/og"),
    inLanguage: "en",
  }

  const source: SoftwareSourceCode = {
    "@type": "SoftwareSourceCode",
    "@id": SOURCE_ID,
    name: siteConfig.name,
    codeRepository: siteConfig.githubUrl,
    programmingLanguage: ["TypeScript"],
    author: { "@id": PERSON_ID },
    license: licenseUrl,
    isPartOf: { "@id": APP_ID },
  }

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, application, source],
  }
}

export function breadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
): WithContext<BreadcrumbList> {
  const itemListElement: ListItem[] = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  }))

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  }
}

export function faqJsonLd(
  faqs: readonly { question: string; answer: string }[],
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

function pageJsonLd(pageKey: PageKey): WithContext<WebPage | AboutPage> {
  const page = PAGES[pageKey]
  const description = truncateDescription(page.description)

  const base: WebPage = {
    "@type": "WebPage",
    "@id": `${absoluteUrl(page.path)}#webpage`,
    url: absoluteUrl(page.path),
    name: page.title,
    description,
    inLanguage: "en",
    dateModified: page.lastModified,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: ogImageUrl({ title: page.ogTitle, description }),
    },
  }

  if (pageKey === "about") {
    return {
      "@context": "https://schema.org",
      ...base,
      "@type": "AboutPage",
      mainEntity: { "@id": APP_ID },
    }
  }

  return {
    "@context": "https://schema.org",
    ...base,
    ...(pageKey === "home" ? { mainEntity: { "@id": APP_ID } } : {}),
  }
}

function truncateDescription(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) {
    return normalized
  }

  const truncated = normalized.slice(0, maxLength - 1)
  const lastSpace = truncated.lastIndexOf(" ")
  const safeCut = lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated
  return `${safeCut.trimEnd()}…`
}
