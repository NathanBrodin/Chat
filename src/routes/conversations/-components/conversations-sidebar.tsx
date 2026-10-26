import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"

import { AppLogo } from "@/components/app-logo"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getContextPercent } from "@/lib/chat/context-usage"
import { conversationsQueryOptions } from "@/lib/chat/queries"
import type { ConversationSummary } from "@/lib/chat/store"

import { RelativeTime } from "./relative-time"

export function ConversationsSidebar() {
  const conversations = useQuery(conversationsQueryOptions())
  const { id: activeId } = useParams({ strict: false })

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <SidebarMenuButton
            render={<Link to="/" />}
            tooltip="Home"
            className="w-fit min-w-0 justify-start whitespace-nowrap transition-[width,height,padding,opacity] group-data-[collapsible=icon]:size-0! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:opacity-0"
          >
            <AppLogo />
          </SidebarMenuButton>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.isPending ? (
                Array.from({ length: 8 }, (_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))
              ) : conversations.isError ? (
                <SidebarMenuItem>
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">
                    Couldn't load conversations.
                  </p>
                </SidebarMenuItem>
              ) : conversations.data.length === 0 ? (
                <SidebarMenuItem>
                  <p className="px-2 py-1.5 text-xs text-muted-foreground">No conversations yet.</p>
                </SidebarMenuItem>
              ) : (
                conversations.data.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={conversation.id === activeId}
                  />
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

function ConversationItem({
  conversation,
  isActive,
}: {
  conversation: ConversationSummary
  isActive: boolean
}) {
  const place = [conversation.city, conversation.country].filter(Boolean).join(", ")
  const contextPercent = getContextPercent(conversation.usage)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={conversation.title}
        render={<Link to="/conversations/$id" params={{ id: conversation.id }} />}
        className="h-auto py-1.5"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
          <span className="truncate text-sm font-medium">{conversation.title}</span>
          <span className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
            <RelativeTime date={conversation.createdAt} />
            {place && <span className="truncate">· {place}</span>}
          </span>
        </div>
        <CircularProgress
          value={contextPercent}
          aria-label={`Context ${contextPercent}% used`}
          className="size-4 shrink-0"
        />
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
