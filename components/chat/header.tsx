import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import type { ChatUIMessage } from "@/tools";
import { ChatContext } from "@/components/chat/context";

export function ChatHeader({ messages }: { messages: ChatUIMessage[] }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 px-6 py-3">
      <Link href="/" className="text-sm font-medium">
        Chat
      </Link>
      <div className="flex gap-2 items-center">

      <ChatContext messages={messages} />
      { /* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <Button variant="secondary" render={<a href="/" />}>
        <PlusIcon aria-hidden="true" />
        New Chat
      </Button>
      </div>
    </header>
  )
}
