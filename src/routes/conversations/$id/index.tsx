import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, type ErrorComponentProps, Link, useRouter } from "@tanstack/react-router"
import { parseError } from "evlog"
import { RotateCcwIcon, SearchXIcon, TriangleAlertIcon } from "lucide-react"

import { Chat } from "@/components/chat"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { conversationQueryOptions } from "@/lib/chat/queries"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/conversations/$id/")({
  loader: async ({ context, params }) => {
    return await context.queryClient.query(conversationQueryOptions(params.id))
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Conversation · Nathan's AI" }],
      }
    }

    return {
      meta: [{ title: `${loaderData.title} · Nathan's AI` }],
    }
  },
  component: ConversationPage,
  pendingComponent: ConversationPending,
  errorComponent: ConversationError,
  notFoundComponent: ConversationNotFound,
})

function ConversationPage() {
  const { id } = Route.useParams()
  const { data: conversation } = useSuspenseQuery(conversationQueryOptions(id))

  return (
    <Chat
      key={conversation.id}
      id={conversation.id}
      initialMessages={conversation.messages}
      title={conversation.title}
    />
  )
}

function ConversationPending() {
  return (
    <div
      role="status"
      aria-label="Loading conversation"
      className="mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-6 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-6">
        <PendingMessage widths={["w-3/5", "w-5/6"]} />
        <PendingMessage align="end" widths={["w-3/4"]} />
        <PendingMessage widths={["w-1/2", "w-11/12", "w-2/3"]} />
      </div>
      <div className="mx-auto w-full max-w-2xl shrink-0 px-6 pb-2">
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}

function PendingMessage({
  align = "start",
  widths,
}: {
  align?: "start" | "end"
  widths: string[]
}) {
  return (
    <div className={cn("flex flex-col gap-2", align === "end" ? "items-end" : "items-start")}>
      {widths.map((width) => (
        <Skeleton key={width} className={cn("h-4", width)} />
      ))}
    </div>
  )
}

function ConversationError({ error }: ErrorComponentProps) {
  const router = useRouter()
  const parsed = parseError(error)

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>Couldn't load this conversation</EmptyTitle>
        <EmptyDescription>
          {parsed.why ?? "Something went wrong while loading it. Try again in a moment."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button type="button" onClick={() => void router.invalidate()}>
            <RotateCcwIcon aria-hidden="true" />
            Try again
          </Button>
          <Button variant="secondary" render={<Link to="/" />}>
            New chat
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}

function ConversationNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>Conversation not found</EmptyTitle>
        <EmptyDescription>
          This conversation may have been deleted, or the link is incorrect.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link to="/" />}>Start a new chat</Button>
      </EmptyContent>
    </Empty>
  )
}
