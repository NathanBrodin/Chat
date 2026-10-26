import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { ChatMessage } from "@/components/chat/chat-message"
import { TooltipProvider } from "@/components/ui/tooltip"
import { conversationQueryOptions } from "@/lib/chat/queries"

export const Route = createFileRoute("/conversations/$id/")({
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
    <TooltipProvider>
      <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-col gap-4">
          <Link
            to="/conversations"
            className="w-fit text-sm text-muted-foreground hover:text-foreground"
          >
            ← Conversations
          </Link>
          <h1 className="text-lg font-semibold">{query.data.title}</h1>
        </div>
        <div className="flex flex-col gap-6">
          {query.data.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
