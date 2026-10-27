import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { conversationsQueryOptions } from "@/lib/chat/queries"

import { ConversationsSidebar } from "./-components/conversations-sidebar"
import { $setSidebarOpen, sidebarOpenQueryOptions } from "./-lib/cookies"

export const Route = createFileRoute("/conversations")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.query(conversationsQueryOptions()),
      context.queryClient.query(sidebarOpenQueryOptions()),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { data: sidebarOpen } = useSuspenseQuery(sidebarOpenQueryOptions())
  const queryKey = sidebarOpenQueryOptions().queryKey
  const setSidebarOpen = useServerFn($setSidebarOpen)

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
      className="h-svh overflow-hidden"
      onOpenChange={(open) => persistSidebarOpen.mutate(open)}
      open={sidebarOpen}
    >
      <ConversationsSidebar />
      <SidebarInset className="isolate overflow-hidden">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
