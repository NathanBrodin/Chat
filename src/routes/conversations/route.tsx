import { createFileRoute, Outlet } from "@tanstack/react-router"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { conversationsQueryOptions } from "@/lib/chat/queries"

import { ConversationsSidebar } from "./-components/conversations-sidebar"

export const Route = createFileRoute("/conversations")({
  loader: async ({ context }) => {
    // The sidebar is the list's only view, so load it before the layout renders.
    await context.queryClient.query(conversationsQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <TooltipProvider>
      {/* Bound the shell to the viewport so the chat scrolls internally, like the home page. */}
      <SidebarProvider className="h-svh overflow-hidden">
        <ConversationsSidebar />
        <SidebarInset className="isolate overflow-hidden">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
