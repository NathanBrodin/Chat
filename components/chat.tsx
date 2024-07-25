"use client"

import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Conversation } from "@/components/conversation"
import { EmptyConversation } from "@/components/empty-conversation"
import { PromptForm } from "@/components/prompt-form"
import { SideBar } from "@/components/side-bar"
import { Separator } from "@/components/ui/separator"
import { useUIState } from "@/hooks/use-ai"

export default function Chat() {
  const [messages, setMessages] = useUIState()

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <AnimatePresence initial={false}>{messages.length === 0 && <EmptyConversation />}</AnimatePresence>
      <Conversation messages={messages} />

      <Separator />
      <div className="flex w-full justify-between p-1 sm:p-4">
        <Link
          className="hidden place-self-end text-xs text-muted-foreground sm:block"
          href="https://brodin.dev"
          target="_blank"
        >
          Nathan&apos;s AI
        </Link>
        <PromptForm messages={messages} setMessages={setMessages} />
        <div />
      </div>
      <div className="absolute left-0 top-0 m-4">
        <SideBar />
      </div>
    </div>
  )
}
