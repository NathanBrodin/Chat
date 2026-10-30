import { Link } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function ConversationsMobileHeader() {
  return (
    <header className="flex shrink-0 items-center gap-2 bg-background px-4 py-3 md:hidden">
      <SidebarTrigger aria-label="Open conversations" className="-ms-1" />
      <Link
        to="/conversations"
        className="min-w-0 truncate font-heading text-sm text-muted-foreground"
      >
        Conversations
      </Link>
      <Button className="ms-auto shrink-0" variant="secondary" render={<Link to="/" />}>
        <PlusIcon aria-hidden="true" />
        New Chat
      </Button>
    </header>
  )
}
