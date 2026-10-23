import { createFileRoute } from "@tanstack/react-router"

import { Chat } from "@/components/chat"
import { TooltipProvider } from "@/components/ui/tooltip"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <TooltipProvider>
      <div className="relative isolate flex h-svh min-h-0 flex-col overflow-hidden">
        <Chat />
      </div>
    </TooltipProvider>
  )
}
