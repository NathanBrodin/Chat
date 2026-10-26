import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"

import { conversationsQueryOptions } from "@/lib/chat/queries"

export const Route = createFileRoute("/conversations/")({
  component: ConversationsPage,
})

function ConversationsPage() {
  const query = useQuery(conversationsQueryOptions())

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-4 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Conversations</h1>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          New chat
        </Link>
      </div>

      {query.isPending ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : query.isError ? (
        <p className="text-sm text-muted-foreground">Couldn't load conversations.</p>
      ) : query.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No conversations yet.</p>
      ) : (
        <ul className="flex flex-col divide-y">
          {query.data.map((conversation) => (
            <li key={conversation.id}>
              <Link
                to="/conversations/$id"
                params={{ id: conversation.id }}
                className="flex flex-col gap-1 py-3"
              >
                <span className="text-sm font-medium">{conversation.title}</span>
                <span className="text-xs text-muted-foreground">
                  {[conversation.city, conversation.country].filter(Boolean).join(", ") || "—"}
                  {" · "}
                  {conversation.createdAt.toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
