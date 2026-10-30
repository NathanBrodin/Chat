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
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { ChatUIMessage } from "@/lib/chat/tools"
import { cn } from "@/lib/utils"

export function ChatHeader({
  messages,
  title,
  showSidebar = false,
}: {
  messages: ChatUIMessage[]
  title?: string
  showSidebar?: boolean
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 px-4 py-3 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showSidebar && (
          <SidebarTrigger aria-label="Open conversations" className="-ms-2 md:hidden" />
        )}
        <Breadcrumb className="min-w-0 flex-1">
          <BreadcrumbList className="min-w-0 flex-nowrap">
            <BreadcrumbItem className={cn("shrink-0", showSidebar && "max-md:hidden")}>
              <BreadcrumbLink render={<Link to="/conversations" />}>Conversations</BreadcrumbLink>
            </BreadcrumbItem>
            {title && (
              <>
                <BreadcrumbSeparator className={cn("shrink-0", showSidebar && "max-md:hidden")} />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
