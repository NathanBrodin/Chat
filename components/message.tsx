import { cva } from "class-variance-authority"
import { Loader, Terminal, User } from "lucide-react"
import remarkGfm from "remark-gfm"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CodeBlock, Pre } from "@/components/ui/code"
import { ChatMessage } from "@/lib/types"
import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"
import { MemoizedReactMarkdown } from "./markdown"

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
            <CopyButton content={message.content as string} className="opacity-0 group-hover/message:opacity-100" />
          )}
        </div>
      </AlertTitle>
      <AlertDescription className="mr-10">
        {message.status === "loading" ? (
          <div className="flex items-center">
            <div className="animate-pulse">Thinking...</div>
            <Loader className="ml-2 h-4 w-4 animate-spin" />
          </div>
        ) : (
          <MemoizedReactMarkdown
            className="prose prose-sm prose-stone !max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm]}
            components={{ code: CodeBlock, pre: Pre }}
          >
            {message.content as string}
          </MemoizedReactMarkdown>
        )}
      </AlertDescription>
    </Alert>
  )
}
