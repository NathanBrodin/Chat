import { createFileRoute } from "@tanstack/react-router"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ContentPage } from "@/components/content-page"
import { privacyLastUpdated, privacyMarkdown } from "@/content/pages"
import { breadcrumbJsonLd, buildSeoHead, PAGES, privacyPageJsonLd } from "@/lib/seo"

export const Route = createFileRoute("/privacy")({
  head: () => {
    const seo = buildSeoHead("privacy")

    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(privacyPageJsonLd()),
        },
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
      eyebrow="Privacy"
      title="Privacy"
      description={PAGES.privacy.description}
      lastUpdated={privacyLastUpdated}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyMarkdown}</ReactMarkdown>
    </ContentPage>
  )
}
