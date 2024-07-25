import { headers } from "next/headers"
import Chat from "@/components/chat"
import { AI } from "@/lib/chat/actions"

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic"
export const maxDuration = 30

export default function Home() {
  const header = headers()
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0]

  return (
    <main className="flex h-[100dvh] w-screen bg-background text-foreground">
      <AI>
        <Chat ip={ip} />
      </AI>
    </main>
  )
}
