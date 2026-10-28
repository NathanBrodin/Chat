import { createFileRoute } from "@tanstack/react-router"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { ContentPage } from "@/components/content-page"
import { aboutFaqs, aboutLastUpdated, aboutMarkdown } from "@/content/pages"
import { aboutPageJsonLd, breadcrumbJsonLd, buildSeoHead, faqJsonLd, PAGES } from "@/lib/seo"

export const Route = createFileRoute("/about")({
  head: () => {
    const seo = buildSeoHead("about")

    return {
      meta: seo.meta,
      links: [
        ...seo.links,
        {
          rel: "alternate",
          type: "text/markdown",
          href: "/about.md",
          title: "About Nathan's AI (Markdown)",
        },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(aboutPageJsonLd()),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(faqJsonLd(aboutFaqs)),
        },
      ],
    }
  },
  component: AboutPage,
})

function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title="About Nathan's AI"
      description={PAGES.about.description}
      lastUpdated={aboutLastUpdated}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutMarkdown}</ReactMarkdown>
    </ContentPage>
  )
}
