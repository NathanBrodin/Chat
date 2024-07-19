"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { ChatMessage } from "@/lib/types"
import { Message } from "./message"

type ConversationProps = {
  messages: ChatMessage[]
}

export function Conversation({ messages }: ConversationProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={listRef}
      className="flex w-full flex-grow flex-col-reverse items-center overflow-auto px-2 py-2 pt-10 sm:my-4"
    >
      <div className="w-full max-w-7xl space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{
                height: 0,
              }}
              transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
            >
              <Message message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
