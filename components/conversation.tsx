"use client";

import { ChatMessage } from "@/lib/types";
import { Message } from "./message";
import { useEffect, useRef } from "react";

type ConversationProps = {
  messages: ChatMessage[];
};

export function Conversation({ messages }: ConversationProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={listRef}
      className="my-8 flex w-full flex-grow flex-col-reverse items-center overflow-auto px-2"
    >
      <div className="w-full max-w-7xl space-y-2">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
