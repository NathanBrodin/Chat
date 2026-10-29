import { createFileRoute } from "@tanstack/react-router"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ContentPage } from "@/components/content-page"
import { breadcrumbJsonLd, buildSeoHead, PAGES } from "@/config/site"
import { privacyLastUpdated, privacyMarkdown } from "@/content/pages"

export const Route = createFileRoute("/privacy/")({
  head: () => {
    const seo = buildSeoHead("privacy")

    return {
      meta: seo.meta,
      links: [
        ...seo.links,
        {
          rel: "alternate",
          type: "text/markdown",
          href: "/privacy.md",
          title: "Privacy (Markdown)",
        },
      ],
      scripts: [
        ...seo.scripts,
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Privacy", path: "/privacy" },
            ]),
          ),
        },
      ],
    }
  },
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy"
      description={PAGES.privacy.description}
      lastUpdated={privacyLastUpdated}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyMarkdown}</ReactMarkdown>
    </ContentPage>
  )
}
