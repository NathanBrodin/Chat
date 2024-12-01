"use client"

import { format } from "date-fns"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
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
  const params = useParams()
  const conversationId = params.conversationId

  function getCountryName(countryCode: string | null) {
    if (!countryCode) return ""

    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
      return regionNames.of(countryCode)
    } catch (error) {
      return countryCode // fallback to code if translation fails
    }
  }

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
                className={cn(
                  "flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  conversationId === conversation.id && "bg-background text-primary"
                )}
              >
                <div className="flex w-full items-end gap-2">
                  <span className="font-medium">
                    {conversation.city ? decodeURIComponent(conversation.city) : ""}
                    {conversation.country ? `, ${getCountryName(conversation.country)}` : ""}
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
