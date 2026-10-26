import { Link } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

import { ChatContext } from "@/components/chat/context"
import { Button } from "@/components/ui/button"
import type { ChatUIMessage } from "@/tools"

export function ChatHeader({ messages }: { messages: ChatUIMessage[] }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 px-6 py-3">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm font-medium">
          Chat
        </Link>
        <Link to="/conversations" className="text-sm text-muted-foreground hover:text-foreground">
          Conversations
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ChatContext messages={messages} />
        <Button variant="secondary" render={<a href="/" aria-label="New chat" />}>
          <PlusIcon aria-hidden="true" />
          New Chat
        </Button>
      </div>
    </header>
  )
}
