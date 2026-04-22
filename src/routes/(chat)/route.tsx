import { createFileRoute, Outlet } from '@tanstack/react-router'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { ChatSidebar } from './-components/chat-sidebar'

export const Route = createFileRoute('/(chat)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
