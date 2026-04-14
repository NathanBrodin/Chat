import { convexQuery } from '@convex-dev/react-query'
import { api } from '@convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { Link, useRouteContext } from '@tanstack/react-router'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

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

export function Conversations() {
  const isAuthenticated = useRouteContext({
    from: '/(chat)',
    select: (s) => s.isAuthenticated,
  })

  // Fetch Convex conversations for authenticated users
  const { data: convexConversations } = useQuery({
    ...convexQuery(api.chat.listByUser, isAuthenticated ? {} : 'skip'),
  })

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
                      to="/chat/$id"
                      params={{ id: item.id }}
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
