import { createFileRoute } from "@tanstack/react-router"

import { Chat } from "@/components/chat"
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <SidebarProvider className="h-svh overflow-hidden" defaultOpen={false} toggleable={false}>
      <Sidebar variant="inset" collapsible="offcanvas" />
      <SidebarInset className="isolate overflow-hidden md:ml-2">
        <Chat />
      </SidebarInset>
    </SidebarProvider>
  )
}
