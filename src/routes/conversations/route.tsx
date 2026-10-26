import { createFileRoute, Outlet } from "@tanstack/react-router"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { conversationsQueryOptions } from "@/lib/chat/queries"

import { ConversationsSidebar } from "./-components/conversations-sidebar"

export const Route = createFileRoute("/conversations")({
  loader: async ({ context }) => {
    await context.queryClient.query(conversationsQueryOptions())
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ConversationsSidebar />
      <SidebarInset className="isolate overflow-hidden">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
