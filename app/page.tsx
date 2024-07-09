"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/lib/types";
import { useState, useRef, useTransition } from "react";
import { addMessage } from "./actions";
import Conversation from "@/components/conversation";
import { Separator } from "@/components/ui/separator";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuid(),
      content: "Hello, welcome to Justina GPT",
      role: "assistant",
    },
  ]);

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    startTransition(async () => {
      const newMessages = await addMessage(messages, formData);
      setMessages(newMessages);

      formRef.current?.reset(); // Reset the form after sending
    });
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center bg-background text-foreground">
      <Conversation messages={messages} />
      <Separator />
      <div className="flex w-full justify-center p-8">
        <form
          ref={formRef}
          className="flex w-full max-w-sm items-center space-x-2"
          action={handleAction}
        >
          <Input type="text" name="input" placeholder="Type your question" />
          <Button type="submit" disabled={isPending} className="w-32">
            {isPending ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </main>
  );
}
