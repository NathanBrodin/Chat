import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { useSyncExternalStore } from "react"

import { AppLogo } from "@/components/app-logo"
import { GithubStarsButton } from "@/components/github-stars-button"
import { ProjectMenu } from "@/components/project-menu"
import { CircularProgress } from "@/components/ui/circular-progress"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
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
  useSidebar,
} from "@/components/ui/sidebar"
import { getContextPercent } from "@/lib/chat/context-usage"
import { formatCost } from "@/lib/chat/format"
import { model } from "@/lib/chat/model"
import { conversationsQueryOptions } from "@/lib/chat/queries"
import type { ConversationSummary } from "@/lib/chat/store"

import { RelativeTime } from "./relative-time"

function subscribeToPlatform() {
  return () => {}
}

function getIsMac() {
  return /Mac|iPhone|iPad/i.test(navigator.userAgent)
}

function getServerIsMac() {
  return false
}

function useIsMac() {
  return useSyncExternalStore(subscribeToPlatform, getIsMac, getServerIsMac)
}

export function ConversationsSidebar() {
  const conversations = useQuery(conversationsQueryOptions())
  const { id: activeId } = useParams({ strict: false })
  const { isMobile, state } = useSidebar()
  const isMac = useIsMac()

  const toggleLabel = state === "collapsed" ? "Show Sidebar" : "Hide Sidebar"

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
          <SidebarTrigger
            aria-keyshortcuts="Control+B Meta+B"
            aria-label={toggleLabel}
            tooltip={{
              hidden: isMobile,
              children: (
                <span className="flex items-center gap-1.5">
                  {toggleLabel}
                  <KbdGroup>
                    <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                    <Kbd>B</Kbd>
                  </KbdGroup>
                </span>
              ),
            }}
          />
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
      <SidebarFooter>
        <div className="flex items-center justify-between gap-1 group-data-[collapsible=icon]:flex-col">
          <GithubStarsButton />
          <ProjectMenu />
        </div>
      </SidebarFooter>
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
  const contextPercent = getContextPercent(
    conversation.metadata?.usage,
    conversation.metadata?.model.contextWindow ?? model.contextWindow,
  )
  const cost = conversation.metadata?.cost ?? 0
  const tooltip = cost > 0 ? `${conversation.title} · ${formatCost(cost)}` : conversation.title

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={tooltip}
        render={<Link to="/conversations/$id" params={{ id: conversation.id }} />}
        className="flex h-auto flex-row items-start py-1.5"
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
