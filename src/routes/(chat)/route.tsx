import type { UIMessage } from 'ai'

import { api } from '@convex/_generated/api'
import { createFileRoute, notFound, useParams } from '@tanstack/react-router'
import { useQuery } from 'convex/react'

import { Chat } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'

import { ChatSidebar } from './-components/chat-sidebar'

export const Route = createFileRoute('/(chat)')({
  loader: ({ context }) => context.queryClient.ensureQueryData(currentUserQueryOptions),
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false })

  const conversation = useQuery(api.chat.get, id ? { conversationId: id as never } : 'skip')
  const rawMessages = useQuery(api.chat.getMessages, id ? { conversationId: id as never } : 'skip')

  const messages = rawMessages?.map((message) => JSON.parse(message) as UIMessage) || []

  if (id && conversation === null) {
    throw notFound()
  }

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
        <Chat initialMessages={messages} title={conversation?.title} />
      </SidebarInset>
    </SidebarProvider>
  )
}
