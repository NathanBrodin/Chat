"use client"

import { format } from "date-fns"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

interface ConversationsSidebarProps {
  conversations: {
    id: string
    city: string | null
    country: string | null
    createdAt: Date | null
    preview: string | null
  }[]
}

export function ConversationsSidebar({ conversations }: ConversationsSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" className="overflow-hidden">
      <SidebarHeader className="gap-3.5 border-b p-4 font-display text-xl font-semibold">Conversations</SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {conversations.map((conversation) => (
              <Link
                href={`/conversations/${conversation.id}`}
                key={conversation.id}
                className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <div className="flex w-full items-end gap-2">
                  <span className="font-medium">
                    {conversation.city}, {conversation.country}
                  </span>
                  <span className="ml-auto text-xs">{format(conversation.createdAt!, "dd MMM yyyy, HH:mm")}</span>
                </div>
                <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">{conversation.preview}</span>
              </Link>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="link">
          <Link href="/">Nathan&apos; AI</Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
