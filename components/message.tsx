import { cva } from "class-variance-authority"
import { Accessibility, Terminal, User } from "lucide-react"
import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChatMessage } from "@/lib/chat/types"
import { cn } from "@/lib/utils"

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

  return (
    <Alert className={cn(messageVariants({ variant }))} variant={variant === "error" ? "destructive" : "default"}>
      {message.role === "assistant" && <Terminal className="h-4 w-4" />}
      {message.role === "user" && <User className="h-4 w-4" />}
      {message.role === "error" && <Accessibility className="h-4 w-4" />}
      <AlertTitle className="relative">{capitalizedRole}</AlertTitle>
      <AlertDescription className="mr-2 min-h-[22.75px] sm:mr-10">{message.display}</AlertDescription>
    </Alert>
  )
}
