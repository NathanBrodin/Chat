"use client"

import { LoaderIcon, SendIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Textarea from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { AnimatedState } from "./ui/animate-state"

type PromptFormProps = {
  addMessage: (input: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({ addMessage, isLoading }: PromptFormProps) {
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
    setInput("")
    await addMessage(input)
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
        placeholder="Curious? Nathan's AI is here to answer!"
        autoComplete="off"
        className="flex max-h-32 w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        onKeyDown={onKeyDown}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button type="submit" disabled={isLoading} size="icon" className="block sm:hidden" aria-label="Send">
        <AnimatedState>
          {isLoading ? <LoaderIcon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
        </AnimatedState>
      </Button>
      <Button type="submit" disabled={isLoading} className="hidden sm:block sm:w-32" aria-label="Send">
        <AnimatedState>{isLoading ? <LoaderIcon className="size-4 animate-spin" /> : <p>Send</p>}</AnimatedState>
      </Button>
    </form>
  )
}
