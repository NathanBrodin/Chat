import type { UIMessage } from 'ai'

import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'

import { Chat } from '@/components/chat'

export const Route = createFileRoute('/(chat)/chat/$id/')({
  loader: async ({ context, params }) => {
    const conversation = await context.queryClient.ensureQueryData(
      convexQuery(api.chat.get, { conversationId: params.id as never }),
    )

    if (!conversation) {
      throw notFound()
    }

    const rawMessages = await context.queryClient.ensureQueryData(
      convexQuery(api.chat.getMessages, { conversationId: params.id as never }),
    )

    const messages = rawMessages.map((message) => JSON.parse(message) as UIMessage)

    return { conversation, messages }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { messages } = Route.useLoaderData()
  const { data: conversation } = useSuspenseQuery(
    convexQuery(api.chat.get, { conversationId: id as never }),
  )

  if (!conversation) {
    throw notFound()
  }

  return <Chat id={id} initialMessages={messages} title={conversation.title} />
}
