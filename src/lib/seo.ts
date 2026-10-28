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

import {
  absoluteUrl,
  APP_ID,
  ogImageUrl,
  PERSON_ID,
  siteConfig,
  SOURCE_ID,
  WEBSITE_ID,
} from "@/lib/site"

const MAX_DESCRIPTION_LENGTH = 160
const LICENSE_URL = `${siteConfig.githubUrl}/blob/main/LICENSE`
const ROBOTS_INDEXABLE =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"

export type PageKey = keyof typeof PAGES

export const PAGES = {
  home: {
    path: "/",
    title: siteConfig.title,
    description: siteConfig.description,
    lastModified: "2026-10-28",
    changefreq: "weekly",
    priority: "1.0",
  },
  about: {
    path: "/about",
    title: "About Nathan's AI | An AI Portfolio by Nathan Brodin",
    description:
      "How Nathan's AI works, what it can answer about Nathan Brodin's experience and projects, and the stack behind this interactive portfolio.",
    lastModified: "2026-10-28",
    changefreq: "monthly",
    priority: "0.8",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy | Nathan's AI",
    description:
      "How Nathan's AI handles conversations, account data, cookies, and approximate location, and what stays public when you share a chat.",
    lastModified: "2026-10-28",
    changefreq: "yearly",
    priority: "0.3",
  },
} as const

export function truncateDescription(value: string, maxLength = MAX_DESCRIPTION_LENGTH) {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) {
    return normalized
  }

  const truncated = normalized.slice(0, maxLength - 1)
  const lastSpace = truncated.lastIndexOf(" ")
  const safeCut = lastSpace > maxLength * 0.6 ? truncated.slice(0, lastSpace) : truncated
  return `${safeCut.trimEnd()}…`
}

export function buildSeoHead(pageKey: PageKey) {
  const page = PAGES[pageKey]
  const description = truncateDescription(page.description)
  const canonical = absoluteUrl(page.path)
  const image = ogImageUrl({ title: page.title, description })
  const imageAlt = `${page.title} — ${siteConfig.author}`

  return {
    meta: [
      { title: page.title },
      { name: "description", content: description },
      { name: "keywords", content: siteConfig.keywords.join(", ") },
      { name: "robots", content: ROBOTS_INDEXABLE },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { property: "og:site_name", content: siteConfig.name },
      { property: "og:title", content: page.title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@nathan_brodin" },
      { name: "twitter:creator", content: "@nathan_brodin" },
      { name: "twitter:title", content: page.title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: imageAlt },
    ],
    links: [{ rel: "canonical", href: canonical }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(webPageJsonLd({ pageKey })),
      },
    ],
  }
}

export function buildNoindexHead({ title, follow = false }: { title: string; follow?: boolean }) {
  return {
    meta: [
      { title },
      { name: "robots", content: follow ? "noindex, follow" : "noindex, nofollow" },
    ],
    links: [],
    scripts: [],
  }
}

const personNode: Person = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: siteConfig.author,
  url: siteConfig.portfolioUrl,
  image: `${siteConfig.portfolioUrl}/og`,
  jobTitle: "Frontend Engineer",
  sameAs: siteConfig.sameAs,
}

const websiteNode: WebSite = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: absoluteUrl("/"),
  name: siteConfig.name,
  alternateName: "Chat with Nathan Brodin's portfolio",
  description: siteConfig.description,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
}

const applicationNode: WebApplication = {
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
  license: LICENSE_URL,
  featureList: [
    "Conversational answers about Nathan Brodin's experience and projects",
    "Streaming AI chat with tool calls",
    "Public, shareable conversations",
    "Open-source TypeScript codebase",
  ],
  screenshot: absoluteUrl("/og"),
  inLanguage: "en",
}

const sourceNode: SoftwareSourceCode = {
  "@type": "SoftwareSourceCode",
  "@id": SOURCE_ID,
  name: siteConfig.name,
  codeRepository: siteConfig.githubUrl,
  programmingLanguage: ["TypeScript"],
  author: { "@id": PERSON_ID },
  license: LICENSE_URL,
  isPartOf: { "@id": APP_ID },
}

export function siteJsonLd(): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode, websiteNode, applicationNode, sourceNode],
  }
}

function pageNode(pageKey: PageKey): WebPage | AboutPage {
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
      url: ogImageUrl({ title: page.title, description }),
    },
  }

  if (pageKey === "about") {
    return {
      ...base,
      "@type": "AboutPage",
    }
  }

  if (pageKey === "home") {
    return {
      ...base,
      mainEntity: { "@id": APP_ID },
    }
  }

  return base
}

export function webPageJsonLd({ pageKey }: { pageKey: PageKey }): WithContext<WebPage | AboutPage> {
  return {
    "@context": "https://schema.org",
    ...pageNode(pageKey),
  }
}

export function aboutPageJsonLd() {
  return webPageJsonLd({ pageKey: "about" })
}

export function privacyPageJsonLd() {
  return webPageJsonLd({ pageKey: "privacy" })
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
