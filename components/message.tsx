import { ChatMessage } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader, Terminal, User } from "lucide-react";
import { CopyButton } from "./copy-button";
import { MemoizedReactMarkdown } from "./markdown";
import remarkGfm from "remark-gfm";

const messageVariants = cva("group", {
  variants: {
    variant: {
      user: "bg-primary-foreground",
      assistant: "border-none pb-8",
    },
  },
  defaultVariants: {
    variant: "user",
  },
});

type MessageProps = {
  message: ChatMessage;
};

export function Message({ message }: MessageProps) {
  const variant = message.role;
  const capitalizedRole =
    message.role.charAt(0).toUpperCase() + message.role.slice(1);

  return (
    <Alert className={cn(messageVariants({ variant }))}>
      {message.role === "assistant" ? (
        <Terminal className="h-4 w-4" />
      ) : (
        <User className="h-4 w-4" />
      )}
      <AlertTitle className="relative">
        {capitalizedRole}
        <div className="absolute right-0 top-0">
          {message.role === "assistant" && (
            <CopyButton content={message.content} />
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
            // TODO: Implement components (cf https://github.com/vercel/ai-chatbot/blob/main/components/ui/codeblock.tsx, https://github.com/vercel/ai-chatbot/blob/main/components/chat-message.tsx)
            className="prose prose-stone prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 !max-w-none break-words"
            remarkPlugins={[remarkGfm]}
          >
            {message.content}
          </MemoizedReactMarkdown>
        )}
      </AlertDescription>
    </Alert>
  );
}
