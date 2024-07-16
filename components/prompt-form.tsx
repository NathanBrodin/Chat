import { Loader } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Textarea from "react-textarea-autosize"
import { v4 as uuid } from "uuid"
import { getAssistantResponse } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { minDelay } from "@/lib/min-delay"
import { ChatMessage } from "@/lib/types"
import { AnimatedState } from "./ui/animate-state"

type PromptFormProps = {
  messages: ChatMessage[]
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

export function PromptForm({ messages, setMessages }: PromptFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { formRef, onKeyDown } = useEnterSubmit()

  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Focus the input when the component mounts and after each message is sent
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const value = input.trim()
    setInput("")
    if (!value) return

    setIsLoading(true)

    // Add user message to the state
    setMessages((prev) => [
      ...prev,
      {
        id: uuid(),
        content: value,
        role: "user",
      },
    ])

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

    // Get the assistant's response
    const assistantResponse = await minDelay(getAssistantResponse(value), 500)

    // Update the assistant's message with the response
    setMessages((prev) =>
      prev.map((msg) => (msg.id === assistantMessageId ? { ...assistantResponse, id: assistantMessageId } : msg))
    )

    setIsLoading(false)
  }

  return (
    <form ref={formRef} className="flex w-full items-end space-x-2" onSubmit={handleSubmit}>
      <Textarea
        ref={inputRef}
        name="input"
        placeholder="How can Nathan's AI help you today?"
        autoComplete="off"
        disabled={isLoading}
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
