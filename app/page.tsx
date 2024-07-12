"use client";

import { ChatMessage } from "@/lib/types";
import { useState } from "react";
import { Conversation } from "@/components/conversation";
import { Separator } from "@/components/ui/separator";
import { PromptForm } from "@/components/prompt-form";
import Link from "next/link";
import { SideBar } from "@/components/side-bar";
import { EmptyConversation } from "@/components/empty-conversation";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <main className="relative flex h-screen w-screen flex-col items-center bg-background text-foreground">
      <AnimatePresence initial={false}>
        {messages.length === 0 && <EmptyConversation />}
      </AnimatePresence>
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
      <div className="absolute left-0 top-0 m-4">
        <SideBar />
      </div>
    </main>
  );
}
