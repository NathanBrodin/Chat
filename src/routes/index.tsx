import { createFileRoute } from "@tanstack/react-router"

import { Chat } from "@/components/chat"

export const Route = createFileRoute("/")({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="relative isolate flex h-svh min-h-0 flex-col overflow-hidden">
      <Chat />
    </div>
  )
}
