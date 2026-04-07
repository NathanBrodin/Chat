import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { ChatSidebar } from './-components/chat-sidebar'

export const Route = createFileRoute('/(app)/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
