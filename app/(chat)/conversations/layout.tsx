import { ConversationsSidebar } from "@/components/conversations-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getConversations } from "@/lib/db/actions"

export const dynamic = "force-dynamic"

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
  const conversations = await getConversations()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <ConversationsSidebar conversations={conversations} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span
            role="link"
            aria-disabled="true"
            aria-current="page"
            className="text-sm font-light italic text-foreground md:text-base"
          >
            You curious one, stop peeking at other peoples conversations
          </span>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
