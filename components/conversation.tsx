"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef } from "react"
import { UIState } from "@/lib/chat/types"
import { Message } from "./message"

type ConversationProps = {
  messages: UIState
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
      className="relative z-10 flex w-full flex-grow flex-col-reverse items-center overflow-auto px-2 py-2 pt-10 sm:my-4"
    >
      <div className="fixed inset-0 z-10 h-[120px] w-full bg-gradient-to-b from-background to-transparent" />
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
