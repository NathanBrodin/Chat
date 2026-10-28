export const site = {
  url: "https://chat.brodin.dev",
  name: "Nathan's AI",
  description: "A minimal AI chat template built with TanStack Start and OpenRouter.",
  author: "Nathan Brodin",
  authorUrl: "https://brodin.dev",
  twitterHandle: "@nathan_brodin",
  twitterUrl: "https://x.com/nathan_brodin",
  githubHandle: "NathanBrodin",
  githubUrl: "https://github.com/NathanBrodin",
  githubRepo: "NathanBrodin/chatbot-template",
  linkedinHandle: "nathan-brodin",
  linkedinUrl: "https://linkedin.com/in/nathan-brodin",
} as const

export function getRootHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: site.author },
      { name: "creator", content: site.author },
      { name: "publisher", content: site.author },
      { name: "theme-color", content: "#fafafa", media: "(prefers-color-scheme: light)" },
      { name: "theme-color", content: "#09090b", media: "(prefers-color-scheme: dark)" },
    ],
    links: [
      {
        rel: "author",
        href: site.authorUrl,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }
}
