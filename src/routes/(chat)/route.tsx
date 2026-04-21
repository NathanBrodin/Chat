import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, useParams } from '@tanstack/react-router'

import { Chat } from '@/components/chat'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { currentUserQueryOptions } from '@/lib/auth/current-user-query'
import { parseStoredMessages } from '@/lib/chat/utils'

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

    void context.queryClient.prefetchQuery(
      convexQuery(api.chat.getMessages, { conversationId: id as never }),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ strict: false })

  const conversation = useQuery({
    ...convexQuery(api.chat.get, id ? { conversationId: id as never } : 'skip'),
  })

  const messages = useQuery({
    ...convexQuery(api.chat.getMessages, id ? { conversationId: id as never } : 'skip'),
  })

  const initialMessages = parseStoredMessages(messages.data)

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ChatSidebar />
      <SidebarInset className="flex min-h-0 flex-1 flex-col divide-y overflow-hidden">
        <Chat
          conversationId={id}
          initialMessages={initialMessages}
          title={conversation.data?.title}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
