import Chat from "@/components/chat"
import { SideBar } from "@/components/side-bar"
import { AI } from "@/lib/chat/actions"

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic"
export const maxDuration = 30

export default function Home() {
  return (
    <main className="relative flex h-[100dvh] w-screen bg-background text-foreground">
      <AI>
        <Chat />
      </AI>
      <div className="absolute left-0 top-0 z-20 m-4">
        <SideBar />
      </div>
    </main>
  )
}
