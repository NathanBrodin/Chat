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
import { useEffect, useRef, useState } from "react"
import { getConversations } from "@/lib/db/actions"
import { Loader } from "./loader"

type Conversation = {
  id: string
  city: string | null
  country: string | null
  createdAt: Date | null
  preview: string | null
}

export function ConversationsSidebar() {
  const params = useParams()
  const conversationId = params.conversationId

  // Infinite scroll
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const observerTarget = useRef(null)

  useEffect(() => {
    const fetchConversations = async () => {
      if (!hasMore || loading) return

      setLoading(true)
      try {
        const result = await getConversations(page)

        // For page 1, replace the posts array; for subsequent pages, append
        if (page === 1) {
          setConversations(result.conversations)
        } else {
          setConversations((prev) => [...prev, ...result.conversations])
        }

        setHasMore(result.hasMore)
        setInitialLoad(false)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [page])

  useEffect(() => {
    // Don't set up observer during initial load
    if (initialLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, initialLoad])

  function getCountryName(countryCode: string | null) {
    if (!countryCode) return ""

    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" })
      return regionNames.of(countryCode)
    } catch {
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
                <span className="break-spaces line-clamp-2 w-[260px] text-xs">{conversation.preview}</span>
              </Link>
            ))}

            {loading && (
              <div className="flex w-full justify-center py-4">
                <Loader content="Loading more" />
              </div>
            )}

            {hasMore && <div ref={observerTarget} className="h-10" />}
            {!hasMore && conversations.length > 0 && (
              <p className="py-4 text-center text-muted-foreground">That&apos;s all!</p>
            )}
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
