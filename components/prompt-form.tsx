"use client"

import { readStreamableValue } from "ai/rsc"
import { Loader } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Textarea from "react-textarea-autosize"
import { v4 as uuid } from "uuid"
import { continueConversation } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { minDelay } from "@/lib/min-delay"
import { ChatMessage } from "@/lib/types"
import { AnimatedState } from "./ui/animate-state"

type PromptFormProps = {
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  ip?: string
}

export function PromptForm({ messages, setMessages, ip }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { formRef, onKeyDown } = useEnterSubmit()

  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const value = input.trim()
    if (!value) return

    // Add user message to the state
    const newMessages: ChatMessage[] = [...messages, { id: uuid(), content: value, role: "user" }]

    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    // Add a placeholder assistant message
    const assistantMessageId = uuid()
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        content: "",
        role: "assistant",
        status: "loading",
      },
    ])

    // Get the assistant's response, with a minimum delay of 500ms to prevent flickering
    const result = await minDelay(continueConversation(newMessages, ip), 100)

    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          content: content as string,
        },
      ])
    }

    setIsLoading(false)
  }

  return (
    <form ref={formRef} className="flex w-full items-end space-x-2" onSubmit={handleSubmit}>
      <Textarea
        ref={inputRef}
        tabIndex={0}
        rows={1}
        autoFocus
        name="input"
        placeholder="How can Nathan's AI help you today?"
        autoComplete="off"
        className="flex w-96 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        onKeyDown={onKeyDown}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button type="submit" disabled={isLoading} className="w-32">
        <AnimatedState>{isLoading ? <Loader className="size-4 animate-spin" /> : "Send"}</AnimatedState>
      </Button>
    </form>
  )
}
