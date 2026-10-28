import { createFileRoute, Link } from "@tanstack/react-router"
import { MessageSquareIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { buildNoindexHead } from "@/lib/seo"

export const Route = createFileRoute("/conversations/")({
  component: ConversationsPage,
  head: () => ({
    ...buildNoindexHead({ title: "Conversations | Nathan's AI" }),
    links: [],
    scripts: [],
  }),
})

function ConversationsPage() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareIcon />
        </EmptyMedia>
        <EmptyTitle>No conversation selected</EmptyTitle>
        <EmptyDescription>
          Choose a conversation from the sidebar, or start a new chat.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link to="/" />}>New chat</Button>
      </EmptyContent>
    </Empty>
  )
}
