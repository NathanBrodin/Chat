"use client"

import { LoaderIcon, SendIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Textarea from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { AnimatedState } from "./ui/animate-state"
import { useVibration } from "@/hooks/use-vibrate"

type PromptFormProps = {
  addMessage: (input: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({ addMessage, isLoading }: PromptFormProps) {
  const vibrate = useVibration()
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
    vibrate()
    await addMessage(input)
  }

  return (
    <form
      ref={formRef}
      className="flex w-full items-end justify-center space-x-1 py-1 sm:max-w-lg sm:space-x-2 sm:py-4 md:max-w-xl"
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
        className="text-md flex max-h-32 w-full resize-none rounded-xl border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        onKeyDown={onKeyDown}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        size="icon"
        className="block sm:hidden"
        aria-label="Send"
      >
        <AnimatedState>{isLoading ? <LoaderIcon className="animate-spin" /> : <SendIcon className="" />}</AnimatedState>
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="group hidden h-[38px] sm:block sm:w-32"
        aria-label="Send"
      >
        <AnimatedState>
          {isLoading ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            <p className="flex items-center justify-center">
              Send
              <svg
                className="translate-x-2 scale-50 stroke-primary-foreground stroke-2"
                fill="none"
                width="7"
                height="7"
                viewBox="0 0 10 10"
                aria-hidden="true"
              >
                <path className="opacity-0 transition duration-200 group-hover:opacity-100" d="M0 5h7"></path>
                <path className="transition duration-200 group-hover:translate-x-[3px]" d="M1 1l4 4-4 4"></path>
              </svg>
            </p>
          )}
        </AnimatedState>
      </Button>
    </form>
  )
}
