import { ChatMessage } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader, Terminal, User } from "lucide-react";

const messageVariants = cva("", {
  variants: {
    variant: {
      user: "bg-primary-foreground",
      assistant: "",
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
      <AlertTitle>{capitalizedRole}</AlertTitle>
      <AlertDescription>
        {message.status === "loading" ? (
          <div className="flex items-center">
            <div className="animate-pulse">Thinking...</div>
            <Loader className="ml-2 h-4 w-4 animate-spin" />
          </div>
        ) : (
          message.content
        )}
      </AlertDescription>
    </Alert>
  );
}
