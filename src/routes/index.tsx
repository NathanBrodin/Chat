import { createFileRoute } from "@tanstack/react-router"

import { Chat } from "@/components/chat"
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { buildSeoHead } from "@/config/site"

export const Route = createFileRoute("/")({
  head: () => {
    const seo = buildSeoHead("home")

    return {
      ...seo,
      links: [
        ...seo.links,
        {
          rel: "alternate",
          type: "text/markdown",
          href: "/llms.md",
          title: "Nathan's AI site index (Markdown)",
        },
      ],
    }
  },
  component: HomePage,
})

function HomePage() {
  return (
    <SidebarProvider className="h-svh overflow-hidden" defaultOpen={false} toggleable={false}>
      <Sidebar variant="inset" collapsible="offcanvas" />
      <SidebarInset id="main-content" tabIndex={-1} className="isolate overflow-hidden md:ml-2">
        <Chat />
      </SidebarInset>
    </SidebarProvider>
  )
}
