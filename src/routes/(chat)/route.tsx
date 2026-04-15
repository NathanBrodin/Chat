import type { UIMessage } from 'ai'

import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, useParams } from '@tanstack/react-router'

import { Chat } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'

import { ChatSidebar } from './-components/chat-sidebar'

export const Route = createFileRoute('/(chat)')({
  loader: async ({ context, location }) => {
    await context.queryClient.ensureQueryData(currentUserQueryOptions)

    const id = location.pathname.match(/^\/chat\/([^/]+)$/)?.[1]

    if (!id) {
      return
    }

    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.chat.get, { conversationId: id as never }),
      ),
      context.queryClient.ensureQueryData(
        convexQuery(api.chat.getMessages, { conversationId: id as never }),
      ),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false })

  const { data: conversation } = useQuery({
    ...convexQuery(api.chat.get, id ? { conversationId: id as never } : 'skip'),
  })
  const { data: rawMessages } = useQuery({
    ...convexQuery(api.chat.getMessages, id ? { conversationId: id as never } : 'skip'),
  })

  const messages = rawMessages?.map((message) => JSON.parse(message) as UIMessage) || []

  if (id && conversation === null) {
    throw notFound()
  }

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
        <Chat key={id} initialMessages={messages} title={conversation?.title} />
      </SidebarInset>
    </SidebarProvider>
  )
}
