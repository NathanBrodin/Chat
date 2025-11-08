"use client"

import { Geo } from "@vercel/edge"
import { generateId } from "ai"
import { readStreamableValue } from "@ai-sdk/rsc"
import { AnimatePresence } from "motion/react"
import { useState } from "react"
import { Conversation } from "@/components/conversation"
import { EmptyConversation } from "@/components/empty-conversation"
import { PromptForm } from "@/components/prompt-form"
import { Separator } from "@/components/ui/separator"
import { useActions, useUIState } from "@/hooks/use-ai"
import { UIState } from "@/lib/chat/types"
import { Question } from "@/lib/questions/types"
import { Content } from "./content"
import InfoDialog from "./info-dialog"
import { Loader } from "./loader"
import { useVibration } from "@/hooks/use-vibrate"

type ChatProps = {
  location: Geo
  questions: Question[]
}

export default function Chat({ questions, location }: ChatProps) {
  const vibrate = useVibration()
  const [messages, setMessages] = useUIState()
  const { continueConversation } = useActions()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

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

    // Add a delay before the second vibration
    setTimeout(() => {
      // Add vibration when streaming begins
      vibrate()
    }, 200) // 200ms delay to make it distinct from the first vibration

    try {
      // Get the assistant's response
      const result = await continueConversation(value, location)

      let textContent = ""

      for await (const delta of readStreamableValue(result)) {
        textContent = `${textContent}${delta}`

        setMessages([
          ...newMessages,
          { id: assistantMessageId, role: "assistant", display: <Content content={textContent} /> },
        ])
      }
    } catch (error) {
      setIsError(true)
      setMessages([
        ...newMessages,
        {
          id: assistantMessageId,
          role: "error",
          display:
            (error as Error).message === "Rate limit exceeded"
              ? "Whoa, easy there big talker! You've hit the rate limit. Give it a moment before asking more."
              : "Oops, something went wrong! Maybe it's a server error (unlikely, I never make mistakes), an issue with my AI provider, or... I might be out of AI credits. Sad times :( Try refreshing the page, it always works.",
        },
      ])
    }

    // Add vibration when streaming ends
    vibrate()

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
        <InfoDialog className="hidden sm:flex" />
        <PromptForm addMessage={addMessage} isLoading={isLoading} isError={isError} />
        <div />
      </div>
    </div>
  )
}
