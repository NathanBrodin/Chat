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
import { cn, getCountryName } from "@/lib/utils"
import { Button } from "./ui/button"
import { useEffect, useRef, useState } from "react"
import { getConversations } from "@/lib/db/actions"
import { Loader } from "./loader"
import { Filters, FiltersPopover } from "./filters-popover"

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
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const observerTarget = useRef(null)

  const [filters, setFilters] = useState<Filters>({
    countries: [],
    dateRange: null,
  })

  // Function to apply filters and reset pagination
  function handleApplyFilters(newFilters: Filters) {
    setFilters(newFilters)
    // Reset to page 1 when applying new filters
    setPage(1)
    setConversations([])
    setHasMore(true)
  }

  useEffect(() => {
    const fetchConversations = async () => {
      if (!hasMore || loading) return

      setLoading(true)
      try {
        const countryValues = filters.countries.map((item) => item.value)
        const dateRange = filters.dateRange?.value

        // Pass these values to your getConversations function
        const result = await getConversations({
          page,
          countries: countryValues.length > 0 ? countryValues : undefined,
          dateRange: dateRange || undefined,
        })

        // For page 1, replace the posts array; for subsequent pages, append
        if (page === 1) {
          setConversations(result.conversations)
        } else {
          setConversations((prev) => [...prev, ...result.conversations])
        }

        setTotalCount(result.totalCount)
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

  return (
    <Sidebar collapsible="offcanvas" className="overflow-hidden">
      <SidebarHeader className="gap-3.5 border-b p-4 font-display text-xl font-semibold">
        <Link href="/conversations">Conversations</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <div className="flex items-center justify-between border-b p-2 pt-0">
              <FiltersPopover filters={filters} onApplyFilters={handleApplyFilters} />
              <div className="">{totalCount} results</div>
            </div>
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
                <Loader content={initialLoad ? "Loading conversations" : "Loading more"} />
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
