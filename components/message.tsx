import { cva } from "class-variance-authority"
import { Terminal, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChatMessage } from "@/lib/chat/types"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

const messageVariants = cva("group/message", {
  variants: {
    variant: {
      user: "bg-primary-foreground",
      assistant: "border-none pb-2 sm:pb-8",
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

  if (variant !== "user" && variant !== "assistant") {
    throw new Error(`Invalid message role: ${variant}`)
  }

  const capitalizedRole = message.role.charAt(0).toUpperCase() + message.role.slice(1)

  return (
    <Alert className={cn(messageVariants({ variant }))}>
      {message.role === "assistant" ? <Terminal className="h-4 w-4" /> : <User className="h-4 w-4" />}
      <AlertTitle className="relative">
        {capitalizedRole}
        <div className="absolute right-0 top-0">
          {message.role === "assistant" && (
            <CopyButton content={message.display as string} className="opacity-0 group-hover/message:opacity-100" />
          )}
        </div>
      </AlertTitle>
      <AlertDescription className="mr-10 min-h-[22.75px]">{message.display}</AlertDescription>
    </Alert>
  )
}
