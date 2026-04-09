import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'

import { ChatSidebar } from './-components/chat-sidebar'

export const Route = createFileRoute('/(app)/chat')({
  loader: ({ context }) => context.queryClient.ensureQueryData(currentUserQueryOptions),
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
