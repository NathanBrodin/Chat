import { api } from '@convex/_generated/api'
import { Link } from '@tanstack/react-router'
import { usePaginatedQuery } from 'convex/react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const getRelativeTime = (input: number): string => {
  const deltaSeconds = Math.floor((Date.now() - input) / 1000)

  // Handle future dates or extremely recent events
  if (deltaSeconds < 30) return 'just now'

  const units = [
    { label: 'y', seconds: 31536000 },
    { label: 'mo', seconds: 2592000 },
    { label: 'w', seconds: 604800 },
    { label: 'd', seconds: 86400 },
    { label: 'h', seconds: 3600 },
    { label: 'm', seconds: 60 },
  ] as const

  for (const { label, seconds } of units) {
    const count = Math.floor(deltaSeconds / seconds)
    if (count >= 1) {
      return `${count}${label} ago`
    }
  }

  return 'just now'
}

export function Conversations() {
  const { results: conversations, status } = usePaginatedQuery(
    api.thread.listThreads,
    {},
    { initialNumItems: 20 },
  )

  const isLoading = status === 'LoadingFirstPage'

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Conversations</SidebarGroupLabel>
      <div className="hidden h-8 group-data-[collapsible=icon]:block" />
      <SidebarMenu>
        {!isLoading && conversations.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No conversations yet
          </p>
        )}
        {conversations.map((conversation) => (
          <SidebarMenuItem key={conversation._id}>
            <SidebarMenuButton
              className="justify-between group-data-[collapsible=icon]:justify-center"
              tooltip={conversation.title}
              render={
                <Link
                  to="/chat/$id"
                  params={{ id: conversation._id }}
                  activeProps={{ 'data-active': true } as Record<string, unknown>}
                />
              }
            >
              <span className="line-clamp-1 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0">
                {conversation.title}
              </span>

              <span className="shrink-0 text-xs text-muted-foreground transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:invisible group-data-[collapsible=icon]:opacity-0">
                {getRelativeTime(conversation._creationTime)}
              </span>

              <span className="pointer-events-none absolute inset-x-3 top-1/2 size-2 -translate-y-1/2 rounded-full bg-muted-foreground opacity-0 transition-opacity duration-200 ease-linear group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:data-[active=true]:opacity-100" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
