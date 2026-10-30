import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { conversationsQueryOptions } from "@/lib/chat/queries"

import { ConversationsMobileHeader } from "./-components/conversations-mobile-header"
import { ConversationsSidebar } from "./-components/conversations-sidebar"
import { $setSidebarOpen, sidebarOpenQueryOptions } from "./-lib/cookies"

export const Route = createFileRoute("/conversations")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.infiniteQuery(conversationsQueryOptions()),
      context.queryClient.query(sidebarOpenQueryOptions()),
    ])
  },
  head: () => ({
    meta: [
      { title: "Conversations · Nathan's AI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data: sidebarOpen } = useSuspenseQuery(sidebarOpenQueryOptions())
  const queryKey = sidebarOpenQueryOptions().queryKey
  const setSidebarOpen = useServerFn($setSidebarOpen)
  const { id } = useParams({ strict: false })

  const persistSidebarOpen = useMutation({
    mutationFn: (open: boolean) => setSidebarOpen({ data: { open } }),
    onMutate: (open) => {
      const previous = queryClient.getQueryData<boolean>(queryKey)
      queryClient.setQueryData(queryKey, open)
      return { previous }
    },
    onError: (_error, _open, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous)
      }
    },
  })

  return (
    <SidebarProvider
      className="h-dvh overflow-hidden"
      onOpenChange={(open) => persistSidebarOpen.mutate(open)}
      open={sidebarOpen}
    >
      <ConversationsSidebar />
      <SidebarInset id="main-content" className="isolate overflow-hidden">
        {!id && <ConversationsMobileHeader />}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
