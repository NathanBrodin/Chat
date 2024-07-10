"use client";

import { ChatMessage } from "@/lib/types";
import { useState } from "react";
import { Conversation } from "@/components/conversation";
import { Separator } from "@/components/ui/separator";
import { v4 as uuid } from "uuid";
import { PromptForm } from "@/components/prompt-form";
import Link from "next/link";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuid(),
      content: "Hello, what can I do for you?",
      role: "assistant",
    },
  ]);

  return (
    <main className="flex h-screen w-screen flex-col items-center bg-background text-foreground">
      <Conversation messages={messages} />
      <Separator />
      <div className="flex w-full justify-between p-4">
        <Link
          className="place-self-end text-xs text-muted-foreground"
          href="https://brodin.dev"
          target="_blank"
        >
          Nathan&apos;s AI
        </Link>
        <div className="py-4">
          <PromptForm messages={messages} setMessages={setMessages} />
        </div>
        <div />
      </div>
    </main>
  );
}
