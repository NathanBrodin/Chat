import { cva } from "class-variance-authority"
import { Accessibility, Terminal, User } from "lucide-react"
import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChatMessage } from "@/lib/chat/types"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

// Helper function to extract the text content from a ReactNode
const extractText = (node: React.ReactNode): string | null => {
  if (typeof node === "string") {
    return node
  }
  if (React.isValidElement(node)) {
    // Type assertion to tell TypeScript that props has a children property
    const props = node.props as { children?: React.ReactNode }
    if (props.children) {
      return extractText(props.children)
    }
  }
  return null
}

const messageVariants = cva("group/message", {
  variants: {
    variant: {
      user: "bg-primary-foreground",
      assistant: "border-none pb-2 sm:pb-8",
      error: "border-none pb-2 sm:pb-8",
    },
  },
  defaultVariants: {
    variant: "user",
  },
})

type MessageProps = {
  message: ChatMessage
}

export function Message({ message }: MessageProps) {
  const variant = message.role
  const capitalizedRole = message.role.charAt(0).toUpperCase() + message.role.slice(1)
  const displayText = extractText(message.display)

  return (
    <Alert className={cn(messageVariants({ variant }))} variant={variant === "error" ? "destructive" : "default"}>
      {message.role === "assistant" && <Terminal className="h-4 w-4" />}
      {message.role === "user" && <User className="h-4 w-4" />}
      {message.role === "error" && <Accessibility className="h-4 w-4" />}
      <AlertTitle className="relative">
        {capitalizedRole}
        <div className="absolute right-0 top-0">
          {displayText && message.role === "assistant" && (
            <CopyButton content={displayText as string} className="opacity-0 group-hover/message:opacity-100" />
          )}
        </div>
      </AlertTitle>
      <AlertDescription className="mr-2 min-h-[22.75px] sm:mr-10">{message.display}</AlertDescription>
    </Alert>
  )
}
