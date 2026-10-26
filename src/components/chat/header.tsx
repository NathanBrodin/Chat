import { Link } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

import { ChatContext } from "@/components/chat/context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import type { ChatUIMessage } from "@/tools"

export function ChatHeader({ messages, title }: { messages: ChatUIMessage[]; title?: string }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 px-6 py-3">
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="min-w-0 flex-nowrap">
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink render={<Link to="/conversations" />}>Conversations</BreadcrumbLink>
          </BreadcrumbItem>
          {title && (
            <>
              <BreadcrumbSeparator className="shrink-0" />
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex shrink-0 items-center gap-2">
        <ChatContext messages={messages} />
        <Button variant="secondary" render={<a href="/" aria-label="New chat" />}>
          <PlusIcon aria-hidden="true" />
          New Chat
        </Button>
      </div>
    </header>
  )
}
