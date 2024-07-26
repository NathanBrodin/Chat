"use client"

import { generateId } from "ai"
import { readStreamableValue } from "ai/rsc"
import { CornerDownRight, LoaderIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Textarea from "react-textarea-autosize"
import { useWindowSize } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { useActions } from "@/hooks/use-ai"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { UIState } from "@/lib/chat/types"
import { Content } from "./content"
import { Loader } from "./loader"
import { AnimatedState } from "./ui/animate-state"

type PromptFormProps = {
  messages: UIState
  setMessages: (v: UIState | ((v_: UIState) => UIState)) => void
}

export function PromptForm({ messages, setMessages }: PromptFormProps) {
  const { width = 0 } = useWindowSize()
  const [isLoading, setIsLoading] = useState(false)
  const { formRef, onKeyDown } = useEnterSubmit()

  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // TODO: Implement type safety
  const { continueConversation } = useActions()

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
    const newMessages: UIState = [...messages, { id: generateId(), display: value, role: "user" }]

    setMessages(newMessages)
    setInput("")
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

    for await (const content of readStreamableValue(result)) {
      setMessages([
        ...newMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          display: <Content content={content as string} />,
        },
      ])
    }

    setIsLoading(false)
  }

  return (
    <form
      ref={formRef}
      className="flex w-full items-end justify-center space-x-2 py-1 sm:max-w-lg sm:py-4 md:max-w-xl"
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={inputRef}
        tabIndex={0}
        rows={1}
        autoFocus
        name="input"
        placeholder="How can Nathan's AI help you today?"
        autoComplete="off"
        className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        onKeyDown={onKeyDown}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button type="submit" disabled={isLoading} size={width < 640 ? "icon" : "default"} className="sm:w-32">
        <AnimatedState>
          {isLoading ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <>
              <p className="hidden sm:block">Send</p>
              <CornerDownRight className="block size-4 sm:hidden" />
            </>
          )}
        </AnimatedState>
      </Button>
    </form>
  )
}
