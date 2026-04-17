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

    const id = location.pathname.match(/^\/chat\/([^/]+)\/?$/)?.[1]

    if (!id) {
      return
    }

    const conversation = await context.queryClient.ensureQueryData(
      convexQuery(api.chat.get, { conversationId: id as never }),
    )

    if (!conversation) {
      throw notFound()
    }

    await context.queryClient.ensureQueryData(
      convexQuery(api.chat.getMessages, { conversationId: id as never }),
    )
  },
  component: RouteComponent,
})

function parseStoredMessages(rawMessages: string[] | undefined): UIMessage[] {
  if (!rawMessages) {
    return []
  }

  const messages: UIMessage[] = []

  for (const rawMessage of rawMessages) {
    try {
      messages.push(JSON.parse(rawMessage) as UIMessage)
    } catch (error) {
      console.error('Failed to parse stored message:', error)
    }
  }

  return messages
}

function ChatRouteLoading() {
  return (
    <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
      Loading conversation...
    </div>
  )
}

function RouteComponent() {
  const { id } = useParams({ strict: false })

  const conversationQuery = useQuery({
    ...convexQuery(api.chat.get, id ? { conversationId: id as never } : 'skip'),
  })

  const messagesQuery = useQuery({
    ...convexQuery(api.chat.getMessages, id ? { conversationId: id as never } : 'skip'),
  })

  if (id && (conversationQuery.isPending || messagesQuery.isPending)) {
    return (
      <SidebarProvider className="h-svh overflow-hidden">
        <ChatSidebar />
        <SidebarInset className="flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
          <ChatRouteLoading />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (id && !conversationQuery.data) {
    throw notFound()
  }

  const initialMessages = parseStoredMessages(messagesQuery.data)

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
        <Chat
          key={id ?? 'new-chat'}
          conversationId={id}
          initialMessages={initialMessages}
          title={conversationQuery.data?.title}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
