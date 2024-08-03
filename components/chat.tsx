"use client"

import { generateId } from "ai"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Conversation } from "@/components/conversation"
import { EmptyConversation } from "@/components/empty-conversation"
import { PromptForm } from "@/components/prompt-form"
import { Separator } from "@/components/ui/separator"
import { useActions, useUIState } from "@/hooks/use-ai"
import { UIState } from "@/lib/chat/types"
import { Loader } from "./loader"

export default function Chat() {
  const [messages, setMessages] = useUIState()
  const { continueConversation } = useActions()
  const [isLoading, setIsLoading] = useState(false)

  async function addMessage(input: string) {
    const value = input.trim()
    if (!value) return

    // Add user message to the state
    const newMessages: UIState = [...messages, { id: generateId(), display: value, role: "user" }]

    setMessages(newMessages)
    setIsLoading(true)

    // Add a placeholder assistant message
    const assistantMessageId = generateId()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        display: <Loader />,
        role: "assistant",
      },
    ])

    // Get the assistant's response
    const result = await continueConversation(value)

    setMessages([
      ...newMessages,
      {
        id: assistantMessageId,
        role: "assistant",
        display: result,
      },
    ])

    setIsLoading(false)
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <AnimatePresence initial={false} mode="wait">
        {messages.length === 0 && <EmptyConversation addMessage={addMessage} />}
        <Conversation messages={messages} />
      </AnimatePresence>
      <Separator />
      <div className="flex w-full justify-between p-1 sm:p-4">
        <Link
          className="hidden place-self-end text-xs text-muted-foreground sm:block"
          href="https://brodin.dev"
          target="_blank"
        >
          Nathan&apos;s AI
        </Link>
        <PromptForm addMessage={addMessage} isLoading={isLoading} />
        <div />
      </div>
    </div>
  )
}
