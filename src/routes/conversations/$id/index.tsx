import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Chat } from "@/components/chat"
import { conversationQueryOptions } from "@/lib/chat/queries"

export const Route = createFileRoute("/conversations/$id/")({
  loader: async ({ context, params }) => {
    // Hovering a sidebar item preloads this route, so the conversation is warm
    // before the click lands.
    await context.queryClient.query(conversationQueryOptions(params.id))
  },
  component: ConversationPage,
})

function ConversationPage() {
  const { id } = Route.useParams()
  const query = useQuery(conversationQueryOptions(id))

  if (query.isPending) {
    return <p className="p-6 text-sm text-muted-foreground">Loading…</p>
  }

  if (query.isError) {
    return <p className="p-6 text-sm text-muted-foreground">Couldn't load this conversation.</p>
  }

  if (!query.data) {
    return <p className="p-6 text-sm text-muted-foreground">Conversation not found.</p>
  }

  return (
    <Chat
      key={query.data.id}
      id={query.data.id}
      initialMessages={query.data.messages}
      title={query.data.title}
    />
  )
}
