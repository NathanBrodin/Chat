"use client"

import { Geo } from "@vercel/edge"
import { generateId } from "ai"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Conversation } from "@/components/conversation"
import { EmptyConversation } from "@/components/empty-conversation"
import { PromptForm } from "@/components/prompt-form"
import { Separator } from "@/components/ui/separator"
import { useActions, useUIState } from "@/hooks/use-ai"
import { UIState } from "@/lib/chat/types"
import { Question } from "@/lib/questions/types"
import InfoDialog from "./info-dialog"
import { Loader } from "./loader"

type ChatProps = {
  location: Geo
  questions: Question[]
}

export default function Chat({ questions, location }: ChatProps) {
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

    try {
      // Get the assistant's response
      const result = await continueConversation(value, location)

      setMessages([
        ...newMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          display: result,
        },
      ])
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          id: assistantMessageId,
          role: "error",
          display:
            (error as Error).message === "Rate limit exceeded"
              ? "Whoa, easy there big talker! You've hit the rate limit. Give it a moment before asking more."
              : "Oops, something went wrong!",
        },
      ])
    }
    setIsLoading(false)
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <AnimatePresence initial={false} mode="wait">
        {messages.length === 0 && <EmptyConversation addMessage={addMessage} questions={questions} key="empty" />}
        <Conversation messages={messages} key="conversation" />
      </AnimatePresence>
      <Separator />
      <div className="flex w-full justify-between p-1 sm:p-4">
        <InfoDialog />
        <PromptForm addMessage={addMessage} isLoading={isLoading} />
        <div />
      </div>
    </div>
  )
}
