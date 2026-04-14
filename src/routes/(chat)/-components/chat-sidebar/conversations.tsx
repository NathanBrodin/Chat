import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouteContext } from '@tanstack/react-router'
import { useSyncExternalStore } from 'react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { type LocalConversation, listLocalConversations } from '@/lib/chat/local-storage'

interface ConversationItem {
  id: string
  title: string
  timestamp: number
}

function groupByTimePeriod(items: ConversationItem[]) {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)

  const groups: { label: string; items: ConversationItem[] }[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Previous 7 days', items: [] },
    { label: 'Older', items: [] },
  ]

  for (const item of items) {
    if (item.timestamp >= todayStart.getTime()) {
      groups[0].items.push(item)
    } else if (item.timestamp >= yesterdayStart.getTime()) {
      groups[1].items.push(item)
    } else if (item.timestamp >= weekStart.getTime()) {
      groups[2].items.push(item)
    } else {
      groups[3].items.push(item)
    }
  }

  return groups.filter((g) => g.items.length > 0)
}

// Subscribe to localStorage changes for anonymous conversations
let localSnapshot: LocalConversation[] = []

function getLocalSnapshot(): LocalConversation[] {
  // This is called on every render — keep it cheap
  return localSnapshot
}

function refreshLocalSnapshot() {
  localSnapshot = listLocalConversations()
}

// Initialize on first import (client-side only)
if (typeof window !== 'undefined') {
  refreshLocalSnapshot()
}

function subscribeLocal(callback: () => void) {
  // Re-poll localStorage when storage events fire (other tabs)
  const handler = (e: StorageEvent) => {
    if (e.key?.startsWith('chat:')) {
      refreshLocalSnapshot()
      callback()
    }
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export function Conversations() {
  const isAuthenticated = useRouteContext({
    from: '/(chat)',
    select: (s) => s.isAuthenticated,
  })

  // Fetch Convex conversations for authenticated users
  const { data: convexConversations } = useQuery({
    ...convexQuery(api.conversations.listByUser, isAuthenticated ? {} : 'skip'),
  })

  // Get local conversations for anonymous users
  const localConversations = useSyncExternalStore(subscribeLocal, getLocalSnapshot, () => [])

  // Merge into a unified list
  const items: ConversationItem[] = []

  if (convexConversations) {
    for (const c of convexConversations) {
      items.push({
        id: c._id,
        title: c.title,
        timestamp: c._creationTime,
      })
    }
  }

  if (!isAuthenticated) {
    for (const c of localConversations) {
      items.push({
        id: c.id,
        title: c.title,
        timestamp: c.updatedAt,
      })
    }
  }

  // Sort newest first
  items.sort((a, b) => b.timestamp - a.timestamp)

  const groups = groupByTimePeriod(items)

  if (groups.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Conversations</SidebarGroupLabel>
        <SidebarMenu>
          <p className="px-2 py-4 text-center text-xs text-muted-foreground">
            No conversations yet
          </p>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={
                    <Link
                      to="/chat/$conversationId"
                      params={{ conversationId: item.id }}
                      search={{ initialMessage: undefined }}
                      activeProps={{ 'data-active': true } as Record<string, unknown>}
                    />
                  }
                >
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
